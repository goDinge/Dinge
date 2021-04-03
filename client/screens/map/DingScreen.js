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
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import * as dingActions from '../../store/actions/ding';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DingScreen = (props) => {
  const [error, setError] = useState(undefined);

  const ding = props.route.params;
  const description = JSON.parse(ding.description);
  const user = useSelector((state) => state.user.user);
  const dingLikes = useSelector((state) => state.ding.likesList);

  //console.log(dingLikes);

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
  }, [loadUser]);

  const loadUser = async (user) => {
    setError(null);
    try {
      await dispatch(userActions.getUser(user));
    } catch (err) {
      setError(err.message);
    }
  };

  const publicProfile = (userId) => {
    props.navigation.navigate('Public', userId);
  };

  const likeDingHandler = async (dingId) => {
    setError(null);
    console.log('ding', typeof ding._id);
    try {
      if (ding.likes.includes(user._id)) {
        await dispatch(dingActions.unlikeDing(dingId));
        console.log('not liked');
      } else {
        await dispatch(dingActions.likeDing(dingId));
        console.log('liked');
      }
    } catch (err) {
      setError(err.message);
    }
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
              name="heart-outline"
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
    marginRight: 12,
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
