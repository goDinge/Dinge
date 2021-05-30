import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  AntDesign,
} from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import * as dingActions from '../../store/actions/ding';
import * as dingeActions from '../../store/actions/dinge';
import * as authActions from '../../store/actions/auth';
import * as commentActions from '../../store/actions/comment';

import CustomButton from '../../components/CustomButton';
import CustomSocials from '../../components/CustomSocials';
import CustomComment from '../../components/CustomComment';
import CustomCommentInput from '../../components/CustomCommentInput';

import { timeConverter } from '../../helpers/timeConverter';
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
  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [dingReportModal, setDingReportModal] = useState(false);
  const [text, onChangeText] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editInitialText, setEditInitialText] = useState('');

  const description = JSON.parse(ding.description);

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
    try {
      await dispatch(commentActions.postComment(text, dingId));
      onChangeText(null);
      await dispatch(dingActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
    }
  };

  const editCommentHandler = async (id, dingId) => {
    setError(null);
    try {
      await dispatch(commentActions.editComment(text, id));
      onChangeText(null);
      await dispatch(dingActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
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
    console.log('flag - comment Id: ', id);
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
        {/* <View style={styles.socialIconsContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconLeftContainer}>
              {isLikeLoading ? (
                <View style={styles.iconActInd}>
                  <ActivityIndicator color={Colors.red} size="small" />
                </View>
              ) : (
                <FontAwesome
                  name={initLikeDing ? 'thumbs-up' : 'thumbs-o-up'}
                  color={initLikeDing ? Colors.red : 'black'}
                  size={28}
                  style={
                    initLikeDing
                      ? styles.iconDingThumb
                      : [styles.iconDingThumb, { paddingRight: 5 }]
                  }
                  onPress={() => likeDingHandler(ding._id, user._id)}
                />
              )}
              <Text style={styles.likesCount}>
                {dingState.likes && dingState.likes.length}
              </Text>
            </View>
            <View style={styles.iconRightContainer}>
              <Feather
                name="flag"
                color="black"
                size={28}
                style={styles.icon}
                onPress={openDingReportModelHandler}
              />
              {ding.user === authUser._id ? (
                <AntDesign
                  name="delete"
                  color="black"
                  size={28}
                  style={[styles.icon, { marginRight: 0 }]}
                  onPress={() => deleteDingHandler(ding._id)}
                />
              ) : null}
            </View>
          </View>
          <View style={styles.socialContainer}>
            <Text
              style={styles.userName}
              onPress={() => publicProfileHandler(user._id)}
            >
              {user.name}
            </Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {timeConverter(ding.createdAt)}
              </Text>
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View> */}
        <CustomCommentInput
          ding={ding}
          text={text}
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
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={dingReportModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Do you want to report this Ding?
              </Text>
              <Pressable
                style={styles.openButton}
                onPress={() => {
                  reportDingHandler(ding._id);
                  Alert.alert('Ding reported!');
                  setDingReportModal(!dingReportModal);
                }}
              >
                <Text style={styles.reportText}>Report Ding!</Text>
              </Pressable>
              <View style={styles.right}>
                <MaterialCommunityIcons
                  name="close"
                  size={30}
                  style={styles.iconClose}
                  onPress={() => setDingReportModal(!dingReportModal)}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={editModal}
          onRequestClose={() => {
            setEditModal(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Edit comment:</Text>
              <TextInput
                style={[
                  styles.commentsInput,
                  { marginVertical: 10 },
                  { width: '100%' },
                ]}
                onChangeText={onChangeText}
                value={text}
                multiline={true}
                placeholder="write comment"
                defaultValue={editInitialText}
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  onSelect={() => editCommentHandler(editCommentId, ding._id)}
                >
                  <Text
                    style={[
                      styles.postButtonText,
                      { paddingHorizontal: 15, paddingVertical: 8 },
                    ]}
                  >
                    Confirm Edit
                  </Text>
                </CustomButton>
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton onSelect={cancelEditHandler}>
                  <Text
                    style={[
                      styles.postButtonText,
                      { paddingHorizontal: 15, paddingVertical: 8 },
                    ]}
                  >
                    Cancel
                  </Text>
                </CustomButton>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconLeftContainer: {
    flexDirection: 'row',
  },
  iconRightContainer: {
    flexDirection: 'row',
  },
  iconDingThumb: {
    marginRight: 12,
    padding: 3,
  },
  icon: {
    marginRight: 4,
    padding: 3,
  },
  iconActInd: {
    marginRight: 12,
    paddingRight: 5,
    paddingLeft: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconClose: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  likesCount: {
    fontFamily: 'cereal-bold',
    color: 'black',
    fontSize: 20,
    marginRight: 12,
    padding: 3,
  },
  userName: {
    fontFamily: 'cereal-bold',
    fontSize: 20,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  description: {
    fontFamily: 'cereal-light',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'column',
    position: 'absolute',
    right: 10,
  },
  timeText: {
    fontFamily: 'cereal-medium',
    fontSize: 20,
  },
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
  socialContainer: {
    marginVertical: 10,
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
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
  commentsContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
});

export default DingScreen;
