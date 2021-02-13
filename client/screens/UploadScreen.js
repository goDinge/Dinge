import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const UploadScreen = (props) => {
  const takeImageHandler = () => {
    props.navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imagePreview}>
          <Image style={styles.image} />
          <Text style={styles.textRegular}>No image taken yet</Text>
        </View>
        <Button
          title="Take Picture"
          color={Colors.primary}
          onPress={takeImageHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '90%',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.gray,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textRegular: {
    fontFamily: 'cereal-light',
  },
});

export default UploadScreen;
