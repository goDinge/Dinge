import React from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
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
        placeholder="write comment"
      />
      <View style={styles.postButtonContainer}>
        {!text ? (
          <CustomButton
            style={styles.postButton}
            onSelect={() => Alert.alert('Please type something')}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </CustomButton>
        ) : isCommentLoading ? (
          <CustomButton style={styles.postButton}>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
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
  },
  buttonContainer: {
    width: 170,
    marginVertical: 5,
  },
  postButton: {
    width: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
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
