import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as userActions from '../../store/actions/user';
import * as dingActions from '../../store/actions/ding';
import * as dingeActions from '../../store/actions/dinge';
import * as authActions from '../../store/actions/auth';
import * as commentActions from '../../store/actions/comment';
import * as messageActions from '../../store/actions/message';

import CustomSocials from '../../components/CustomSocials';
import CustomComment from '../../components/CustomComment';
import CustomCommentInput from '../../components/CustomCommentInput';
import CustomReportModal from '../../components/CustomReportModal';
import CustomEditModal from '../../components/CustomEditModal';
import CustomMessageModal from '../../components/CustomMessageModal';
import CustomDeleteModal from '../../components/CustomDeleteModal';

import Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DingScreen = (props) => {
  const ding = props.route.params;
  const authUser = useSelector((state) => state.auth.authUser);
  const dingState = useSelector((state) => state.ding.ding);
  const user = useSelector((state) => state.user.user);
  const locationState = useSelector((state) => state.location.location);
  console.log('ding screen: ', props);

  let initLikeDing = false;
  if (dingState.likes) {
    if (dingState.likes.includes(authUser._id)) {
      initLikeDing = true;
    }
  }

  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [dingReportModal, setDingReportModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [text, onChangeText] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editInitialText, setEditInitialText] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const comments = dingState.comments;

  const dispatch = useDispatch();

  useEffect(() => {
    loadUser(ding.user);
    loadDing(ding._id);
    loadAuthUser();
  }, [loadUser, loadDing]);

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

  const loadDing = async (dingId) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(dingActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const publicProfileHandler = (user) => {
    props.navigation.navigate('Public', user);
  };

  //Like and Unlike
  const likeDingHandler = async (dingId, userId) => {
    setError(null);
    setIsLikeLoading(true);
    //many Actions are dispatched here for the purpose of updating reputation in real time
    //should refactor to improve performance
    try {
      if (initLikeDing) {
        initLikeDing = false;
        await dispatch(dingActions.unlikeDing(dingId));
        //await dispatch(authActions.getAuthUser());
        //await dispatch(userActions.getUser(userId));
      } else {
        initLikeDing = true;
        await dispatch(dingActions.likeDing(dingId));
        //await dispatch(authActions.getAuthUser());
        //await dispatch(userActions.getUser(userId));
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLikeLoading(false);
    await dispatch(dingActions.getDing(dingId));
  };

  //Delete
  const openDingDeleteModalHandler = () => {
    setModalMessage('ding');
    setConfirmDelete(true);
  };

  const deleteDingHandler = async (dingId) => {
    setError(null);
    setIsDeleting(true);
    try {
      await dispatch(dingeActions.deleteDingById(dingId)); //possible to fix reducer so no need to call getLocalDinge for a fresh state?
      await dispatch(dingeActions.getLocalDinge(locationState));
      await setConfirmDelete(false);
      await dispatch(messageActions.setMessage('Ding Deleted'));
    } catch (err) {
      setError(err.message);
    }
    setIsDeleting(false);
    props.navigation.navigate('Map');
  };

  //Report
  const openDingReportModalHandler = () => {
    setDingReportModal(true);
  };

  const reportDingHandler = async (dingId) => {
    setError(null);
    try {
      await dispatch(dingActions.reportDingById(dingId));
    } catch (err) {
      setError(err.message);
    }
  };

  //Comment
  const postCommentHandler = async (text, dingId) => {
    setError(null);
    setIsCommentLoading(true);
    try {
      await dispatch(commentActions.postComment(text, dingId));
      await dispatch(dingActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
    }
    onChangeText(null);
    setIsCommentLoading(false);
  };

  const editCommentHandler = async (id, dingId) => {
    setError(null);
    setIsEditLoading(true);
    try {
      await dispatch(commentActions.editComment(text, id));
      await dispatch(dingActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
    }
    onChangeText(null);
    setEditInitialText('');
    setIsEditLoading(false);
    setEditModal(false);
    cancelEditHandler();
  };

  const openEditorHandler = (id, text) => {
    setEditModal(true);
    setEditCommentId(id);
    setEditInitialText(text);
  };

  const cancelEditHandler = () => {
    setEditModal(false);
    setEditInitialText('');
  };

  const deleteCommentHandler = async (id, dingId) => {
    setError(null);
    try {
      await dispatch(commentActions.deleteComment(id, dingId));
      await dispatch(dingActions.getDing(dingId));
      setModalMessage('Comment Deleted');
      setMessageModal(true);
    } catch (err) {
      setError(err.message);
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

  if (isLoading) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: ding.imgUrl }} />
        </View>
        <View style={styles.lowerInfoContainer}>
          <CustomSocials
            type="ding"
            isLikeLoading={isLikeLoading}
            initLikeItem={initLikeDing}
            itemState={dingState}
            item={ding}
            authUser={authUser}
            user={user}
            onLike={likeDingHandler}
            onFlag={openDingReportModalHandler}
            onDelete={openDingDeleteModalHandler}
            onProfile={() => publicProfileHandler(user._id)}
          />
          <CustomCommentInput
            item={ding}
            text={text}
            isCommentLoading={isCommentLoading}
            onText={onChangeText}
            onComment={postCommentHandler}
          />
          {comments &&
            comments.map((item, index) => {
              return (
                <CustomComment
                  key={index}
                  comment={item}
                  authUser={authUser}
                  item={ding}
                  onProfile={() => publicProfileHandler(item.userId)}
                  onEditor={openEditorHandler}
                  onDelete={deleteCommentHandler}
                  onFlag={reportCommentHandler}
                />
              );
            })}
        </View>
      </ScrollView>
      {/*    **** MODALS ****     */}
      <CustomReportModal
        item={ding}
        itemReportModal={dingReportModal}
        onModalVisible={setDingReportModal}
        onReport={reportDingHandler}
      />
      <CustomEditModal
        editModal={editModal}
        text={text}
        item={ding}
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
        item={ding}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        message={modalMessage}
        setConfirmDelete={setConfirmDelete}
        onDelete={deleteDingHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  scrollViewContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  lowerInfoContainer: {
    width: '96%',
    alignSelf: 'center',
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

export default DingScreen;
