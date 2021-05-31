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

import CustomSocials from '../../components/CustomSocials';
import CustomComment from '../../components/CustomComment';
import CustomCommentInput from '../../components/CustomCommentInput';
import CustomReportModal from '../../components/CustomReportModal';
import CustomEditModal from '../../components/CustomEditModal';
import CustomMessageModal from '../../components/CustomMessageModal';

import Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DingScreen = (props) => {
  const ding = props.route.params;
  const authUser = useSelector((state) => state.auth.authUser);
  const dingState = useSelector((state) => state.ding.ding);
  const user = useSelector((state) => state.user.user);

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
  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [dingReportModal, setDingReportModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [text, onChangeText] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editInitialText, setEditInitialText] = useState('');
  const [modalMessage, setModalMessage] = useState('');

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

  const publicProfileHandler = (userId) => {
    props.navigation.navigate('Public', userId);
  };

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

  const deleteDingHandler = async (dingId) => {
    setError(null);
    try {
      await dispatch(dingeActions.deleteDingById(dingId));
      await dispatch(dingeActions.getDinge());
    } catch (err) {
      setError(err.message);
    }
    props.navigation.navigate('Map');
  };

  const openDingReportModelHandler = () => {
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

  const postCommentHandler = async (text, dingId) => {
    setError(null);
    setIsCommentLoading(true);
    try {
      await dispatch(commentActions.postComment(text, dingId));
      onChangeText(null);
      await dispatch(dingActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
    }
    setIsCommentLoading(false);
  };

  const editCommentHandler = async (id, dingId) => {
    setError(null);
    setIsEditLoading(true);
    try {
      await dispatch(commentActions.editComment(text, id));
      onChangeText(null);
      setEditInitialText('');
      await dispatch(dingActions.getDing(dingId));
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

  const likeCommentHandler = async (id, dingId) => {
    setIsCommentLikeLoading(true);
    const comment = comments.find((comment) => comment._id === id);

    try {
      if (!comment.likes.includes(authUser._id)) {
        await dispatch(commentActions.likeComment(id));
        await dispatch(dingActions.getDing(dingId));
      } else {
        await dispatch(commentActions.unlikeComment(id));
        await dispatch(dingActions.getDing(dingId));
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

  if (isLoading) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: ding.imgUrl }} />
        </View>
        <CustomSocials
          isLikeLoading={isLikeLoading}
          initLikeDing={initLikeDing}
          dingState={dingState}
          ding={ding}
          authUser={authUser}
          user={user}
          onLike={likeDingHandler}
          onFlag={openDingReportModelHandler}
          onDelete={deleteDingHandler}
          onProfile={publicProfileHandler}
        />
        <CustomCommentInput
          ding={ding}
          text={text}
          isCommentLoading={isCommentLoading}
          onText={onChangeText}
          onComment={postCommentHandler}
        />
        <View style={styles.commentsContainer}>
          {comments &&
            comments.map((item, index) => {
              return (
                <CustomComment
                  key={index}
                  item={item}
                  authUser={authUser}
                  ding={ding}
                  isLoading={isCommentLikeLoading}
                  onProfile={publicProfileHandler}
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
        ding={ding}
        dingReportModal={dingReportModal}
        onModalVisible={setDingReportModal}
        onReport={reportDingHandler}
      />
      <CustomEditModal
        editModal={editModal}
        text={text}
        ding={ding}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  socialIconsContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  commentsContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
});

export default DingScreen;
