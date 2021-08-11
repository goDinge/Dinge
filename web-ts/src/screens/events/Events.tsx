import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../../store/reducers/rootReducer';
import {
  event,
  eventsState,
  eventState,
  // messageState,
  locationState,
} from '../../store/interfaces';

import CustomEvent from '../../components/CustomEvent';
import CustomReloadIcon from '../../components/CustomReloadIcon';
import CustomCalendarEventItem from '../../components/CustomCalendarEventItem';
import * as eventsActions from '../../store/actions/events';
// import * as eventActions from '../../store/actions/event';
// import * as messageActions from '../../store/actions/message';
import * as locationActions from '../../store/actions/location';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { Colors } from '../../constants/Colors';
import { sortEvents } from '../../helpers/sortEvents';

const todayEventsDefault = (events: event[]) => {
  let defaultEvents = [];
  for (const event of events) {
    if (
      toLocaleDateStringSimplied(Date.now()).toString().slice(0, 5) ===
      convertDate(event.date.toString())
    ) {
      defaultEvents.push(event);
    }
  }
  return defaultEvents;
};

const Events = () => {
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  // const auth: AuthState = useSelector((state: AppState) => state.auth);
  // const authUser: user | null = auth.authUser;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj = event.event;
  const location: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationObj: GeolocationPosition = location.location;

  //console.log('event location state: ', location);

  const [error, setError] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(
    eventsArr ? todayEventsDefault(eventsArr) : []
  );
  const [dateChosen, setDateChosen] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<Dispatch<any>>();

  const loadEvents = useCallback(
    async (position) => {
      setError(null);
      try {
        await dispatch(eventsActions.getLocalEvents(position));
      } catch (err) {
        setError(err.message);
      }
    },
    [dispatch]
  );

  const getLocation = useCallback(async () => {
    setIsLoading(true);
    await navigator.geolocation.getCurrentPosition((position) => {
      dispatch(locationActions.setLocation(position));
      loadEvents(position);
      setIsLoading(false);
    }, errorCallback);
  }, [dispatch, loadEvents]);

  // useEffect(() => {
  //   loadEvents(locationObj);
  // }, [loadEvents, locationObj]);

  useEffect(() => {
    if (eventsArr.length > 0) {
      setShowEvents(todayEventsDefault(eventsArr.sort(sortEvents)));
    }
  }, [eventsArr]);

  const errorCallback = () => {
    setError(null);
  };

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

  const reloadHandler = async () => {
    //startImageRotateFunction();
    await getLocation();
  };

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

  return (
    <div className="calender-screen">
      <div className="calendar-container">
        <div className="dates-container">
          {nextTwoWeeksArray.map((item, index: number) => {
            return (
              <div
                key={index}
                className="child"
                style={
                  index === dateChosen ? chosenDateContainer : dateContainer
                }
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
        <div className="events-list">
          {showEvents.map((item: event, index: number) => {
            return (
              <CustomCalendarEventItem
                key={index}
                item={item}
                type="calendar"
              />
            );
          })}
        </div>
      </div>
      {eventObj.user !== '' ? <CustomEvent /> : null}
      <CustomReloadIcon onSelect={() => reloadHandler()} />
    </div>
  );
};

export default Events;

const dateContainer = {
  padding: 10,
  textAlign: 'center' as const,
  borderRight: 0.1,
  borderLeft: 0.1,
  borderTop: 1,
  borderBottom: 1,
  borderColor: '#ddd',
  borderStyle: 'solid',
  cursor: 'pointer',
};

const chosenDateContainer = {
  padding: 10,
  textAlign: 'center' as const,
  borderRight: 0.1,
  borderLeft: 0.1,
  borderTop: 1,
  borderBottom: 1,
  borderColor: '#ddd',
  borderStyle: 'solid',
  backgroundColor: Colors.lightSecondary,
  cursor: 'pointer',
};

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

const convertDate = (date: string) => {
  const dateObj = new Date(date).toLocaleDateString('en-US', dateOption);
  return dateObj.slice(0, 5);
};

const convertSlashDate = (slashDate: string) => {
  return slashDate.slice(0, 5);
};

const nextTwoWeeksArray = [
  {
    date: convertSlashDate(currentDate),
    day: convertWeekDay(new Date(currentDateInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusOne),
    day: convertWeekDay(new Date(datePlusOneInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusTwo),
    day: convertWeekDay(new Date(datePlusTwoInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusThree),
    day: convertWeekDay(new Date(datePlusThreeInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusFour),
    day: convertWeekDay(new Date(datePlusFourInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusFive),
    day: convertWeekDay(new Date(datePlusFiveInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusSix),
    day: convertWeekDay(new Date(datePlusSixInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusSeven),
    day: convertWeekDay(new Date(datePlusSevenInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusEight),
    day: convertWeekDay(new Date(datePlusEightInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusNine),
    day: convertWeekDay(new Date(datePlusNineInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusTen),
    day: convertWeekDay(new Date(datePlusTenInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusEleven),
    day: convertWeekDay(new Date(datePlusElevenInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusTwelve),
    day: convertWeekDay(new Date(datePlusTwelveInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusThirteen),
    day: convertWeekDay(new Date(datePlusThirteenInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusFourteen),
    day: convertWeekDay(new Date(datePlusFourteenInMilli).getDay()),
  },
  {
    date: convertSlashDate(datePlusFifteen),
    day: convertWeekDay(new Date(datePlusFifteenInMilli).getDay()),
  },
];
