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
  MaterialIcons,
  FontAwesome,
  Feather,
} from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import * as dingActions from '../../store/actions/ding';
import * as dingeActions from '../../store/actions/dinge';
import * as authActions from '../../store/actions/auth';

import CustomButton from '../../components/CustomButton';
import Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DingScreen = (props) => {
  const ding = props.route.params;
  const authUser = useSelector((state) => state.auth.authUser);
  const dingState = useSelector((state) => state.ding.ding);
  const user = useSelector((state) => state.user.user);

  let initLike = false;
  if (dingState.likes) {
    if (dingState.likes.includes(authUser._id)) {
      initLike = true;
    }
  }

  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editInitialText, setEditInitialText] = useState('');

  const description = JSON.parse(ding.description);

  const comments = dingState.comments;
  //console.log(comments);

  const timeConverter = (dateISO) => {
    const dateDing = new Date(dateISO); //dateISO is time of ding creation that got passed in
    const dateMilli = dateDing.getTime();
    const dateNow = Date.now();
    const timeSinceUpload = dateNow - dateMilli;
    const minutesSinceUpload = Math.ceil(timeSinceUpload / 1000 / 60);
    const hoursSinceUpload = Math.ceil(timeSinceUpload / 1000 / 60 / 60);

    if (minutesSinceUpload < 60) {
      return `${minutesSinceUpload}m`;
    } else {
      return `${hoursSinceUpload}h`;
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    loadUser(ding.user);
    loadDing(ding._id);
    loadAuthUser();
  }, [loadUser, loadDing]);

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
      if (initLike) {
        initLike = false;
        await dispatch(dingActions.unlikeDing(dingId));
        await dispatch(authActions.getAuthUser());
        await dispatch(userActions.getUser(userId));
      } else {
        initLike = true;
        await dispatch(dingActions.likeDing(dingId));
        await dispatch(authActions.getAuthUser());
        await dispatch(userActions.getUser(userId));
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

  const openModelHandler = () => {
    setModalVisible(true);
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
      await dispatch(dingActions.postComment(text, dingId));
      onChangeText(null);
      await dispatch(dingActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
    }
  };

  const editCommentHandler = async (id) => {
    console.log('edit: ', id);
    try {
      await dispatch(dingActions.editComment(text, id));
      onChangeText(null);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
    setEditModal(false);
    setEditInitialText('');
  };

  const openEditorHandler = async (id, text) => {
    console.log('open: ', id);
    setEditModal(true);
    setEditCommentId(id);
    setEditInitialText(text);
  };

  const deleteCommentHandler = async (id) => {
    console.log('delete: ', id);
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
      <View style={styles.centeredView}>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
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
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.reportText}>Report Ding!</Text>
              </Pressable>
              <View style={styles.right}>
                <MaterialCommunityIcons
                  name="close"
                  size={30}
                  style={styles.iconClose}
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <ScrollView>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: ding.imgUrl }} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.iconContainer}>
              <View style={styles.iconLeftContainer}>
                {isLikeLoading ? (
                  <View style={styles.iconActInd}>
                    <ActivityIndicator color={Colors.primary} size="small" />
                  </View>
                ) : (
                  <FontAwesome
                    name={initLike ? 'thumbs-up' : 'thumbs-o-up'}
                    color={initLike ? Colors.primary : 'black'}
                    size={28}
                    style={
                      initLike
                        ? styles.icon
                        : [styles.icon, { paddingRight: 5 }]
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
                  size={28}
                  style={styles.icon}
                  onPress={openModelHandler}
                />
                {ding.user === authUser._id ? (
                  <MaterialIcons
                    name="highlight-remove"
                    size={30}
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
          </View>
          <View style={styles.commentsInputContainer}>
            <TextInput
              style={styles.commentsInput}
              onChangeText={onChangeText}
              value={text}
              multiline={true}
              placeholder="write comment"
            />
            <View style={styles.postButtonContainer}>
              {text ? (
                <CustomButton
                  style={styles.postButton}
                  onSelect={() => postCommentHandler(text, ding._id)}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </CustomButton>
              ) : (
                <CustomButton
                  style={styles.postButton}
                  onSelect={() => Alert.alert('Please type something')}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </CustomButton>
              )}
            </View>
          </View>
          <View style={styles.commentsContainer}>
            {comments &&
              comments.map((item, index) => {
                return (
                  <View key={index} style={styles.outerCommentContainer}>
                    <View style={styles.commentContainer}>
                      <View style={styles.textContainer}>
                        <Text
                          style={styles.commentsUserName}
                          onPress={() => publicProfileHandler(item.userId)}
                        >
                          {item.userName}
                        </Text>
                        <Text style={styles.description}>{item.text}</Text>
                      </View>
                    </View>
                    <Feather
                      name="edit"
                      size={22}
                      style={styles.icon}
                      onPress={() => openEditorHandler(item._id, item.text)}
                    />
                    <Feather
                      name="delete"
                      size={24}
                      style={styles.icon}
                      onPress={() => deleteCommentHandler(item._id)}
                    />
                  </View>
                );
              })}
          </View>
        </ScrollView>
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
                <Text style={styles.modalText}>Edit comment</Text>
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
                    onSelect={() => editCommentHandler(editCommentId)}
                  >
                    <Text
                      style={[styles.postButtonText, { paddingHorizontal: 15 }]}
                    >
                      Confirm Edit
                    </Text>
                  </CustomButton>
                </View>
                <View style={styles.buttonContainer}>
                  <CustomButton onSelect={() => setEditModal(false)}>
                    <Text
                      style={[styles.postButtonText, { paddingHorizontal: 15 }]}
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
  infoContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
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
  icon: {
    marginRight: 12,
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
    alignItems: 'flex-end',
    padding: 5,
  },
  likesCount: {
    fontFamily: 'cereal-bold',
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
    fontSize: 15,
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
    alignSelf: 'flex-end',
  },
  commentsInputContainer: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginBottom: 20,
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
  postButtonContainer: {
    width: 50,
    marginLeft: 10,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginVertical: 5,
  },
  postButton: {
    width: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 5,
    paddingHorizontal: 4,
    fontSize: 16,
    alignSelf: 'center',
  },
  commentsContainer: {
    marginHorizontal: 16,
  },
  outerCommentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  commentContainer: {
    width: '75%',
    marginBottom: 15,
    marginRight: 15,
    backgroundColor: Colors.lightBlue,
    borderRadius: 14,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  textContainer: {
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  commentsUserName: {
    fontFamily: 'cereal-bold',
    fontSize: 14,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  verticalMargin: {
    marginVertical: 10,
  },
});

export default DingScreen;
