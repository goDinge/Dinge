import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../../store/reducers/rootReducer';
import {
  user,
  event,
  AuthState,
  eventsState,
  // eventState,
  // messageState,
  locationState,
} from '../../store/interfaces';

import * as eventsActions from '../../store/actions/events';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { Colors } from '../../constants/Colors';
import { sortEvents } from '../../helpers/sortEvents';
import { convertAMPM } from '../../helpers/dateConversions';

const todayEventsDefault = (events: event[]) => {
  let defaultEvents = [];
  for (const event of events) {
    if (
      convertDate(Date.now().toString()) === convertDate(event.date.toString())
    ) {
      defaultEvents.push(event);
    }
  }
  return defaultEvents;
};

const Events = () => {
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser: user | null = auth.authUser;
  const location: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationObj: GeolocationPosition = location.location;

  const [error, setError] = useState(null);
  const [showEvents, setShowEvents] = useState(
    eventsArr ? todayEventsDefault(eventsArr) : []
  );
  const [dateChosen, setDateChosen] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch<Dispatch<any>>();

  const loadEvents = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await dispatch(eventsActions.getLocalEvents(locationObj));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [dispatch, locationObj, setLoading]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (eventsArr.length > 0) {
      setShowEvents(todayEventsDefault(eventsArr.sort(sortEvents)));
    }
  }, [eventsArr]);

  let eventsToPush: event[] = [];

  //this function makes out of range events viewable
  //after event creation and before refresh
  const pickDateHandler = (date: string, index: number) => {
    setDateChosen(index);
    for (const event of eventsArr) {
      if (date === convertDate(event.date.toString())) {
        eventsToPush.push(event);
      }
    }
    eventsToPush.sort(sortEvents);
    setShowEvents(eventsToPush);
  };

  const Item = ({ item }: { item: event }) => (
    <div className="calendar-event-container">
      <div className="calendar-event-time-container">
        <p className="calendar-event-text">
          {convertAMPM(item.date)} - {convertAMPM(item.endDate)}
        </p>
      </div>
      <div
        className="calendar-event-info-container"
        onClick={() => console.log('event clicked')}
      >
        <p className="calendar-event-title">{item.eventName}</p>
        <p className="calendar-event-text">
          {item.description.split(' ').slice(0, 9).join(' ') + '...'}
        </p>
      </div>
    </div>
  );

  const renderItem = ({ item }: { item: event }) => <Item item={item} />;

  if (isLoading) {
    return (
      <div className="map">
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Loader type="Oval" color={Colors.primary} height={70} width={70} />
        </div>
      </div>
    );
  }

  const dateDivClassName = (index: number) => {
    if (index !== dateChosen) {
      return 'date-container';
    } else {
      return 'chosen-date-container';
    }
  };

  return (
    <div className="calender-screen">
      <div className="calendar-container">
        <div className="dates-container">
          {nextTwoWeeksArray.map((item, index) => {
            return (
              <div
                key={index}
                className={dateDivClassName(index)}
                onClick={() => pickDateHandler(item.date, index)}
              >
                <p
                  className="date-text"
                  style={{ fontSize: 12, paddingBottom: 5 }}
                >
                  {item.date}
                </p>
                <p className="date-text">{item.day}</p>
              </div>
            );
          })}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Events;

//DATE FUNCTIONS
const day = 1000 * 60 * 60 * 24;
const currentDateInMilli = Date.now();
const datePlusOneInMilli = currentDateInMilli + day;
const datePlusTwoInMilli = currentDateInMilli + day * 2;
const datePlusThreeInMilli = currentDateInMilli + day * 3;
const datePlusFourInMilli = currentDateInMilli + day * 4;
const datePlusFiveInMilli = currentDateInMilli + day * 5;
const datePlusSixInMilli = currentDateInMilli + day * 6;
const datePlusSevenInMilli = currentDateInMilli + day * 7;
const datePlusEightInMilli = currentDateInMilli + day * 8;
const datePlusNineInMilli = currentDateInMilli + day * 9;
const datePlusTenInMilli = currentDateInMilli + day * 10;
const datePlusElevenInMilli = currentDateInMilli + day * 11;
const datePlusTwelveInMilli = currentDateInMilli + day * 12;
const datePlusThirteenInMilli = currentDateInMilli + day * 13;
const datePlusFourteenInMilli = currentDateInMilli + day * 14;
const datePlusFifteenInMilli = currentDateInMilli + day * 15;

const dateOption: any = {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
};

const toLocaleDateStringSimplied = (date: number) => {
  return new Date(date).toLocaleDateString('en-US', dateOption);
};

const currentDate = toLocaleDateStringSimplied(currentDateInMilli);
const datePlusOne = toLocaleDateStringSimplied(datePlusOneInMilli);
const datePlusTwo = toLocaleDateStringSimplied(datePlusTwoInMilli);
const datePlusThree = toLocaleDateStringSimplied(datePlusThreeInMilli);
const datePlusFour = toLocaleDateStringSimplied(datePlusFourInMilli);
const datePlusFive = toLocaleDateStringSimplied(datePlusFiveInMilli);
const datePlusSix = toLocaleDateStringSimplied(datePlusSixInMilli);
const datePlusSeven = toLocaleDateStringSimplied(datePlusSevenInMilli);
const datePlusEight = toLocaleDateStringSimplied(datePlusEightInMilli);
const datePlusNine = toLocaleDateStringSimplied(datePlusNineInMilli);
const datePlusTen = toLocaleDateStringSimplied(datePlusTenInMilli);
const datePlusEleven = toLocaleDateStringSimplied(datePlusElevenInMilli);
const datePlusTwelve = toLocaleDateStringSimplied(datePlusTwelveInMilli);
const datePlusThirteen = toLocaleDateStringSimplied(datePlusThirteenInMilli);
const datePlusFourteen = toLocaleDateStringSimplied(datePlusFourteenInMilli);
const datePlusFifteen = toLocaleDateStringSimplied(datePlusFifteenInMilli);

interface convertedType {
  [index: number]: string;
}

const convertWeekDay = (num: number) => {
  const day: convertedType = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  };
  return day[num];
};

const convertDate = (dateInMilli: string) => {
  return dateInMilli.slice(0, 5);
};

const nextTwoWeeksArray = [
  {
    date: convertDate(currentDate),
    day: convertWeekDay(new Date(currentDateInMilli).getDay()),
  },
  {
    date: convertDate(datePlusOne),
    day: convertWeekDay(new Date(datePlusOneInMilli).getDay()),
  },
  {
    date: convertDate(datePlusTwo),
    day: convertWeekDay(new Date(datePlusTwoInMilli).getDay()),
  },
  {
    date: convertDate(datePlusThree),
    day: convertWeekDay(new Date(datePlusThreeInMilli).getDay()),
  },
  {
    date: convertDate(datePlusFour),
    day: convertWeekDay(new Date(datePlusFourInMilli).getDay()),
  },
  {
    date: convertDate(datePlusFive),
    day: convertWeekDay(new Date(datePlusFiveInMilli).getDay()),
  },
  {
    date: convertDate(datePlusSix),
    day: convertWeekDay(new Date(datePlusSixInMilli).getDay()),
  },
  {
    date: convertDate(datePlusSeven),
    day: convertWeekDay(new Date(datePlusSevenInMilli).getDay()),
  },
  {
    date: convertDate(datePlusEight),
    day: convertWeekDay(new Date(datePlusEightInMilli).getDay()),
  },
  {
    date: convertDate(datePlusNine),
    day: convertWeekDay(new Date(datePlusNineInMilli).getDay()),
  },
  {
    date: convertDate(datePlusTen),
    day: convertWeekDay(new Date(datePlusTenInMilli).getDay()),
  },
  {
    date: convertDate(datePlusEleven),
    day: convertWeekDay(new Date(datePlusElevenInMilli).getDay()),
  },
  {
    date: convertDate(datePlusTwelve),
    day: convertWeekDay(new Date(datePlusTwelveInMilli).getDay()),
  },
  {
    date: convertDate(datePlusThirteen),
    day: convertWeekDay(new Date(datePlusThirteenInMilli).getDay()),
  },
  {
    date: convertDate(datePlusFourteen),
    day: convertWeekDay(new Date(datePlusFourteenInMilli).getDay()),
  },
  {
    date: convertDate(datePlusFifteen),
    day: convertWeekDay(new Date(datePlusFifteenInMilli).getDay()),
  },
];
