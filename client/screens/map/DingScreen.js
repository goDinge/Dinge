import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import * as dingActions from '../../store/actions/ding';
import * as dingeActions from '../../store/actions/dinge';
import * as authActions from '../../store/actions/auth';
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

  const description = JSON.parse(ding.description);

  const comments = dingState.comments;
  console.log(comments);

  // const Comment = (props) => (
  //   <View>
  //     <Text>{props.user}</Text>
  //     <Text>{props.text}</Text>
  //   </View>
  // );
  // const renderItem = ({ item }) => <Comment text={item.text} />;

  const timeConverter = (dateISO) => {
    const dateDing = new Date(dateISO);
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

  const likeDingHandler = async (dingId) => {
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
                  <MaterialCommunityIcons
                    name={initLike ? 'thumb-up' : 'thumb-up-outline'}
                    color={initLike ? Colors.primary : 'black'}
                    size={30}
                    style={styles.icon}
                    onPress={() => likeDingHandler(ding._id)}
                  />
                )}

                <Text style={styles.likesCount}>
                  {dingState.likes && dingState.likes.length}
                </Text>
              </View>
              <View style={styles.iconRightContainer}>
                <MaterialCommunityIcons
                  name="comment-outline"
                  size={30}
                  style={styles.icon}
                  onPress={() => console.log('comment')}
                />
                <MaterialCommunityIcons
                  name="flag-outline"
                  size={30}
                  style={styles.icon}
                  onPress={openModelHandler}
                />
                {ding.user === authUser._id ? (
                  <MaterialIcons
                    name="highlight-remove"
                    size={30}
                    style={styles.icon}
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
          <View>
            {comments.map((item, index) => {
              return (
                <View key={index} style={styles.commentsContainer}>
                  <Text style={styles.description}>{item.userName}</Text>
                  <Text style={styles.description}>{item.text}</Text>
                </View>
              );
            })}
            {/* <FlatList
              data={comments}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
            /> */}
          </View>
        </ScrollView>
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
    marginRight: 14,
    paddingRight: 7,
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
    fontFamily: 'cereal-book',
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
  commentsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default DingScreen;
