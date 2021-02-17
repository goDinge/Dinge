import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as userActions from '../store/actions/user';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DingScreen = (props) => {
  const [error, setError] = useState(undefined);

  const ding = props.route.params;
  const user = useSelector((state) => state.user.user);
  console.log(user);

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: ding.imgUrl }} />
        </View>
        <View>
          <Text>{user.name}</Text>
          <Text>{user.status}</Text>
          <Text>{user.level}</Text>
          <Text>{user._id}</Text>
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
});

export default DingScreen;
