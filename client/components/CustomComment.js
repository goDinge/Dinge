import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import * as commentActions from '../store/actions/comment';
import * as dingActions from '../store/actions/ding';

import Colors from '../constants/Colors';

const CustomComment = (props) => {
  const {
    index,
    comment,
    item,
    authUser,
    isLoading,
    onProfile,
    onEditor,
    onDelete,
    //onLike,
    onFlag,
  } = props;

  const [error, setError] = useState(undefined);
  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);

  const dingState = useSelector((state) => state.ding.ding);

  const comments = dingState.comments;
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const likeCommentHandler = async (id, dingId) => {
    setError(null);
    setIsCommentLikeLoading(true);
    const comment = comments.find((comment) => comment._id === id);

    try {
      if (!comment.likes.includes(authUser._id)) {
        await dispatch(commentActions.likeComment(id));
        await dispatch(dingActions.getDing(dingId));
      } else {
        await dispatch(commentActions.unlikeComment(id));
        await dispatch(dingActions.getDing(dingId));
      }
    } catch (err) {
      setError(err.message);
    }
    setIsCommentLikeLoading(false);
  };

  return (
    <View key={index} style={styles.outerCommentContainer}>
      <View style={styles.commentContainer}>
        <View style={styles.textContainer}>
          <Text
            style={styles.commentsUserName}
            onPress={() => onProfile(comment.userId)}
          >
            {comment.userName}
          </Text>
          <Text style={styles.description}>{comment.text}</Text>
        </View>
        <View style={styles.likesCountContainer}>
          <FontAwesome
            name="thumbs-o-up"
            color={Colors.gray}
            size={14}
            style={styles.icon}
          />
          <Text style={styles.miniLikesCount}>{comment.likes.length}</Text>
        </View>
      </View>
      {comment.userId === authUser._id ? (
        <View style={styles.commentsIconContainer}>
          <Feather
            name="edit"
            color={Colors.gray}
            size={22}
            style={styles.icon}
            onPress={() => onEditor(comment._id, comment.text)}
          />
          <Feather
            name="delete"
            color={Colors.gray}
            size={22}
            style={[styles.icon, { left: -4 }]}
            onPress={() => onDelete(comment._id, item._id)}
          />
        </View>
      ) : comment.likes.includes(authUser._id) ? (
        <View style={styles.commentsIconContainer}>
          {isCommentLikeLoading ? (
            <View style={styles.commentLikeActInd}>
              <ActivityIndicator color={Colors.red} size="small" />
            </View>
          ) : (
            <FontAwesome
              name="thumbs-o-up"
              color={Colors.red}
              size={23.2}
              style={styles.icon}
              onPress={() => likeCommentHandler(comment._id, item._id)}
            />
          )}
          <Feather
            name="flag"
            color={Colors.gray}
            size={24}
            style={styles.icon}
            onPress={() => onFlag(comment._id)}
          />
        </View>
      ) : (
        <View style={styles.commentsIconContainer}>
          {isCommentLikeLoading ? (
            <View style={styles.commentLikeActInd}>
              <ActivityIndicator color={Colors.primary} size="small" />
            </View>
          ) : (
            <FontAwesome
              name="thumbs-o-up"
              color={Colors.gray}
              size={23.2}
              style={styles.icon}
              onPress={() => likeCommentHandler(comment._id, item._id)}
            />
          )}
          <Feather
            name="flag"
            size={24}
            color={Colors.gray}
            style={styles.icon}
            onPress={() => onFlag(comment._id)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
    paddingLeft: 6,
  },
  description: {
    fontFamily: 'cereal-light',
    fontSize: 16,
  },
  outerCommentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentContainer: {
    width: '80%',
    alignSelf: 'flex-start',
    marginBottom: 15,
    backgroundColor: Colors.lightBlue,
    borderRadius: 14,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  commentsIconContainer: {
    flexDirection: 'row',
    paddingLeft: 8,
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
  commentLikeActInd: {
    top: 4,
    paddingHorizontal: 5.5,
  },
  likesCountContainer: {
    position: 'absolute',
    zIndex: 1,
    right: 5,
    bottom: -9,
    width: 36,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#777',
  },
  miniLikesCount: {
    fontSize: 14,
    top: 1,
    marginRight: 3,
    fontFamily: 'cereal-book',
  },
});

export default CustomComment;
