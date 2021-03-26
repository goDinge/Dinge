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

const SCREEN_WIDTH = Dimensions.get('window').width;

const DingScreen = (props) => {
  const [error, setError] = useState(undefined);

  const ding = props.route.params;
  const description = JSON.parse(ding.description);
  const user = useSelector((state) => state.user.user);

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

  const publicProfile = () => {
    console.log('public profile');
    props.navigation.navigate('Public');
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
              size={36}
              style={styles.icon}
            />
            <MaterialCommunityIcons
              name="comment-outline"
              size={36}
              style={styles.icon}
            />
            <MaterialCommunityIcons
              name="flag-outline"
              size={38}
              style={styles.icon}
            />
          </View>
          <View style={styles.socialContainer}>
            <Pressable onPressIn={publicProfile}>
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
