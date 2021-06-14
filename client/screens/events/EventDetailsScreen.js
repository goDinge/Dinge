import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';

import * as userActions from '../../store/actions/user';
import * as eventActions from '../../store/actions/event';
import * as eventsActions from '../../store/actions/events';
import * as authActions from '../../store/actions/auth';
import * as commentActions from '../../store/actions/eventComment';
import * as messageActions from '../../store/actions/message';

import CustomMarker from '../../components/CustomMarker';
import CustomSocials from '../../components/CustomSocials';
import CustomComment from '../../components/CustomComment';
import CustomCommentInput from '../../components/CustomCommentInput';
import CustomReportModal from '../../components/CustomReportModal';
import CustomEditModal from '../../components/CustomEditModal';
import CustomMessageModal from '../../components/CustomMessageModal';
import CustomDeleteModal from '../../components/CustomDeleteModal';

import Colors from '../../constants/Colors';

import { convertAMPM, properDate } from '../../helpers/dateConversions';

const mapStyle = require('../../helpers/mapStyle.json');

const SCREEN_WIDTH = Dimensions.get('window').width;

const EventDetailsScreen = (props) => {
  const event = props.route.params;
  const authUser = useSelector((state) => state.auth.authUser);
  const eventState = useSelector((state) => state.event.event);
  const user = useSelector((state) => state.user.user);
  const userLocation = useSelector((state) => state.location.location);

  let initLikeEvent = false;
  if (eventState.likes) {
    if (eventState.likes.includes(authUser._id)) {
      initLikeEvent = true;
    }
  }

  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(location);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [eventReportModal, setEventReportModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [text, onChangeText] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editInitialText, setEditInitialText] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const comments = eventState.comments;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    //console.log('EDS: ', event);
    loadUser(event.user);
    loadEvent(event._id);
    loadAuthUser();
    let location = event.location;
    setLocation(location);
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setIsLoading(false);
  }, [loadUser, loadEvent, loadAuthUser, setIsLoading, setRegion]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const loadUser = async (user) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(userActions.getUser(user));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const loadAuthUser = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.getAuthUser());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const loadEvent = async (eventId) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(eventActions.getEvent(eventId));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  //console.log('event details: ', eventState.eventPic);

  const publicProfileHandler = (user) => {
    //setIsLoading here ensures a smoother transition to 'Public'
    setIsLoading(true);
    props.navigation.navigate('Public', user);
    setIsLoading(false);
  };

  //Like and Unlike
  const likeEventHandler = async (eventId, userId) => {
    setError(null);
    setIsLikeLoading(true);
    try {
      if (initLikeEvent) {
        initLikeEvent = false;
        await dispatch(eventActions.unlikeEvent(eventId));
      } else {
        initLikeEvent = true;
        await dispatch(eventActions.likeEvent(eventId));
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLikeLoading(false);
    await dispatch(eventActions.getEvent(eventId));
  };

  //Delete
  const openEventDeleteModalHandler = () => {
    setModalMessage('event');
    setConfirmDelete(true);
  };

  const deleteEventHandler = async (eventId) => {
    setError(null);
    setIsDeleting(true);
    try {
      await dispatch(eventsActions.deleteEventById(eventId));
      await dispatch(eventsActions.getLocalEvents(userLocation));
      await setConfirmDelete(false);
      await dispatch(messageActions.setMessage('Event Deleted'));
    } catch (err) {
      setError(err.message);
    }
    setIsDeleting(false);
    props.navigation.navigate('Map');
  };

  //Report
  const openEventReportModalHandler = () => {
    setEventReportModal(true);
  };

  const reportEventHandler = async (eventId) => {
    setError(null);
    try {
      await dispatch(eventActions.reportEventById(eventId));
    } catch (err) {
      setError(err.message);
    }
  };

  //Comment
  const postCommentHandler = async (text, eventId) => {
    setError(null);
    setIsCommentLoading(true);
    try {
      await dispatch(commentActions.postComment(text, eventId));
      onChangeText(null);
      await dispatch(eventActions.getEvent(eventId));
    } catch (err) {
      setError(err.message);
    }
    setIsCommentLoading(false);
  };

  const editCommentHandler = async (id, eventId) => {
    setError(null);
    setIsEditLoading(true);
    try {
      await dispatch(commentActions.editComment(text, id));
      onChangeText(null);
      setEditInitialText('');
      await dispatch(eventActions.getEvent(eventId));
    } catch (err) {
      setError(err.message);
    }
    setIsEditLoading(false);
    setEditModal(false);
    cancelEditHandler();
  };

  const openEditorHandler = async (id, text) => {
    setEditModal(true);
    setEditCommentId(id);
    setEditInitialText(text);
  };

  const cancelEditHandler = () => {
    setEditModal(false);
    setEditInitialText('');
  };

  const deleteCommentHandler = async (id, eventId) => {
    setError(null);
    try {
      await dispatch(commentActions.deleteComment(id, eventId));
      await dispatch(eventActions.getEvent(eventId));
      setModalMessage('Comment Deleted');
      setMessageModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const likeCommentHandler = async (id, eventId) => {
    setIsCommentLikeLoading(true);
    const comment = comments.find((comment) => comment._id === id);

    try {
      if (!comment.likes.includes(authUser._id)) {
        await dispatch(commentActions.likeComment(id));
        await dispatch(eventActions.getDing(eventId));
      } else {
        await dispatch(commentActions.unlikeComment(id));
        await dispatch(eventActions.getDing(eventId));
      }
      setIsCommentLikeLoading(false);
    } catch (err) {
      setError(err.message);
      setIsCommentLikeLoading(false);
    }
  };

  const reportCommentHandler = async (id) => {
    setError(null);
    try {
      await dispatch(commentActions.reportComment(id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (
    isLoading ||
    !location ||
    !region ||
    !event ||
    !userLocation ||
    !eventState
  ) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.topInfoContainer}>
          <View style={styles.leftContainer}>
            {eventState.eventPic ? (
              <Image
                style={styles.image}
                source={{ uri: eventState.eventPic }}
              />
            ) : null}
            <Text style={styles.eventTitle}>{event.eventName}</Text>
            <Text style={[styles.eventInfo, { marginBottom: 3 }]}>
              {properDate(event.date)}
            </Text>
            <Text style={[styles.eventInfo, { marginBottom: 8 }]}>
              {convertAMPM(event.date)} - {convertAMPM(event.endDate)}
            </Text>
            <Pressable onPress={() => publicProfileHandler(user._id)}>
              <Text style={styles.eventInfo}>Organizer: {user.name}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.lowerInfoContainer}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              minZoomLevel={13}
              maxZoomLevel={17}
              customMapStyle={mapStyle}
            >
              {isFocused && <CustomMarker data={event} />}
            </MapView>
          </View>
          <View style={styles.aboutInfoContainer}>
            <Text style={[styles.eventTitle, { fontSize: 20 }]}>
              About this event
            </Text>
            <Text style={[styles.eventInfo, { marginBottom: 8 }]}>
              {event.address}
            </Text>
            <Text style={styles.eventText}>{event.description}</Text>
          </View>
          <View style={{ marginVertical: 5 }}>
            <CustomSocials
              type="event"
              isLikeLoading={isLikeLoading}
              initLikeItem={initLikeEvent}
              itemState={eventState}
              item={event}
              authUser={authUser}
              user={user}
              onLike={likeEventHandler}
              onFlag={openEventReportModalHandler}
              onDelete={openEventDeleteModalHandler}
              onProfile={() => publicProfileHandler(user._id)}
            />
          </View>
          <View style={{ marginVertical: 5 }}>
            <CustomCommentInput
              item={event}
              text={text}
              isCommentLoading={isCommentLoading}
              onText={onChangeText}
              onComment={postCommentHandler}
            />
          </View>
          {comments &&
            comments.map((item, index) => {
              return (
                <CustomComment
                  key={index}
                  comment={item}
                  authUser={authUser}
                  item={event}
                  isLoading={isCommentLikeLoading}
                  onProfile={() => publicProfileHandler(user._id)}
                  onEditor={openEditorHandler}
                  onDelete={deleteCommentHandler}
                  onLike={likeCommentHandler}
                  onFlag={reportCommentHandler}
                />
              );
            })}
        </View>
      </ScrollView>
      {/*    **** MODALS ****     */}
      <CustomReportModal
        item={event}
        itemReportModal={eventReportModal}
        onModalVisible={setEventReportModal}
        onReport={reportEventHandler}
      />
      <CustomEditModal
        editModal={editModal}
        text={text}
        item={event}
        isEditLoading={isEditLoading}
        editInitialText={editInitialText}
        editCommentId={editCommentId}
        onEditModal={setEditModal}
        onText={onChangeText}
        onEdit={editCommentHandler}
        onCancel={cancelEditHandler}
      />
      <CustomMessageModal
        message={modalMessage}
        messageModal={messageModal}
        onClose={setMessageModal}
      />
      <CustomDeleteModal
        item={event}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        message={modalMessage}
        setConfirmDelete={setConfirmDelete}
        onDelete={deleteEventHandler}
      />
    </View>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewContainer: {
    width: '96%',
    alignSelf: 'center',
  },
  topInfoContainer: {
    width: '100%',
    marginTop: 6,
    marginBottom: 20,
  },
  eventTitle: {
    fontFamily: 'cereal-bold',
    fontSize: 23,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: (SCREEN_WIDTH * 9) / 16,
    marginBottom: 15,
  },
  eventInfo: {
    fontFamily: 'cereal-medium',
    fontSize: 15,
    color: Colors.gray,
  },
  eventText: {
    fontFamily: 'cereal-light',
    fontSize: 16,
    color: Colors.gray,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  mapContainer: {
    justifyContent: 'center',
  },
  map: {
    height: 200,
  },
  lowerInfoContainer: {
    width: '100%',
  },
  aboutInfoContainer: {
    marginVertical: 16,
  },
  pin: {
    width: 50,
    height: 50,
  },
  //modal styles
  modalText: {
    fontFamily: 'cereal-medium',
    fontSize: 16,
    color: 'black',
  },
  reportText: {
    fontFamily: 'cereal-bold',
    fontSize: 20,
    color: Colors.primary,
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  right: {
    width: '100%',
  },
  commentsInput: {
    width: '80%',
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'cereal-light',
  },
  buttonContainer: {
    width: 170,
    marginVertical: 5,
  },
  buttonFlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
});
