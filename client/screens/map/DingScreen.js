import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import * as dingActions from '../../store/actions/ding';
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

  const description = JSON.parse(ding.description);

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
    console.log('like');
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

  const deleteDing = async (dingId) => {
    setError(null);
    try {
      await dispatch(dingeActions.deleteDingById(dingId));
      await dispatch(dingeActions.getDinge());
    } catch (error) {
      setError(err.message);
    }
    props.navigation.navigate('Map');
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
                onPress={() => console.log('flag')}
              />
              {ding.user === authUser._id ? (
                <MaterialIcons
                  name="highlight-remove"
                  size={30}
                  style={styles.icon}
                  onPress={() => deleteDing(ding._id)}
                />
              ) : null}
            </View>
          </View>
          <View style={styles.socialContainer}>
            <Pressable onPressIn={() => publicProfileHandler(user._id)}>
              <Text style={styles.userName}>{user.name}</Text>
            </Pressable>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {timeConverter(ding.createdAt)}
              </Text>
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </ScrollView>
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
    margin: 16,
    marginLeft: 20,
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
  socialContainer: {
    marginVertical: 15,
  },
});

export default DingScreen;
