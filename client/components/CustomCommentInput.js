import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';

const CustomCommentInput = (props) => {
  const { item, text, isCommentLoading, onText, onComment } = props;

  return (
    <View style={styles.commentsInputContainer}>
      <TextInput
        style={styles.commentsInput}
        onChangeText={onText}
        value={text}
        multiline={true}
        blurOnSubmit={true}
        placeholder="write comment"
      />
      <View style={styles.postButtonContainer}>
        {isCommentLoading ? (
          <CustomButton style={styles.postButton}>
            <Text style={styles.postButtonText}>Posting... </Text>
            <ActivityIndicator
              color="white"
              size="small"
              style={styles.postButtonText}
            />
          </CustomButton>
        ) : (
          <CustomButton
            style={styles.postButton}
            onSelect={() => onComment(text, item._id)}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </CustomButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentsInputContainer: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  commentsInput: {
    width: '100%',
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
    width: '100%',
    marginTop: 10,
  },
  buttonContainer: {
    width: 170,
    marginVertical: 5,
  },
  postButton: {
    width: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default CustomCommentInput;
