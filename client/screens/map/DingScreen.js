import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import * as dingeActions from '../../store/actions/dinge';
import Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DingScreen = (props) => {
  const ding = props.route.params;
  const authUser = useSelector((state) => state.auth.authUser);

  let initLike = false;
  if (ding.likes.includes(authUser._id)) {
    initLike = true;
  }

  const [error, setError] = useState(undefined);
  const [like, setLike] = useState(initLike);

  const description = JSON.parse(ding.description);
  const user = useSelector((state) => state.user.user);
  //const dingUE = useSelector((state) => state.dinge.ding);

  // console.log('ding from props', ding);
  // console.log('ding from UseEffect', dingUE);

  // not useful at the moment, but reducer might come in handy later
  // const dingLikes = useSelector((state) => state.dinge.likesList);
  // console.log('dingLikes', dingLikes);

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
  }, [loadUser, loadDing]);

  const loadUser = async (user) => {
    setError(null);
    try {
      await dispatch(userActions.getUser(user));
    } catch (err) {
      setError(err.message);
    }
  };

  const loadDing = async (dingId) => {
    setError(null);
    try {
      await dispatch(dingeActions.getDing(dingId));
    } catch (err) {
      setError(err.message);
    }
  };

  const publicProfile = (userId) => {
    props.navigation.navigate('Public', userId);
  };

  const likeDingHandler = async (dingId) => {
    setError(null);
    try {
      if (like) {
        setLike(false);
        await dispatch(dingeActions.unlikeDing(dingId));
      } else {
        setLike(true);
        await dispatch(dingeActions.likeDing(dingId));
      }
    } catch (err) {
      setError(err.message);
    }
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: ding.imgUrl }} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={like ? 'heart' : 'heart-outline'}
              color={like ? Colors.red : 'black'}
              size={30}
              style={styles.icon}
              onPress={() => likeDingHandler(ding._id)}
            />
            <MaterialCommunityIcons
              name="comment-outline"
              size={30}
              style={styles.icon}
            />
            <MaterialCommunityIcons
              name="flag-outline"
              size={30}
              style={styles.icon}
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
          <View style={styles.socialContainer}>
            <Pressable onPressIn={() => publicProfile(user._id)}>
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
  imageContainer: {
    width: '100%',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  infoContainer: {
    margin: 16,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 15,
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
    marginVertical: 10,
  },
});

export default DingScreen;
