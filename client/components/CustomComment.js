import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import * as commentActions from '../store/actions/comment';
import * as eventCommentActions from '../store/actions/eventComment';
import * as dingActions from '../store/actions/ding';
import * as eventActions from '../store/actions/event';

//import CustomMessageModal from '../components/CustomMessageModal';

import Colors from '../constants/Colors';

const CustomComment = (props) => {
  const { type, index, comment, item, authUser, onProfile, onEditor, onFlag } =
    props;

  const [error, setError] = useState(undefined);
  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [isCommentDeleteLoading, setIsCommentDeleteLoading] = useState(false);

  const dingState = useSelector((state) => state.ding.ding);
  const eventState = useSelector((state) => state.event.event);

  let comments;
  if (type === 'ding') comments = dingState.comments;
  if (type === 'event') comments = eventState.comments;

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const likeCommentHandler = async (id, itemId) => {
    setError(null);
    setIsCommentLikeLoading(true);
    const comment = comments.find((comment) => comment._id === id);

    try {
      if (type === 'ding') {
        if (!comment.likes.includes(authUser._id)) {
          await dispatch(commentActions.likeComment(id));
        } else {
          await dispatch(commentActions.unlikeComment(id));
        }
        await dispatch(dingActions.getDing(itemId));
      } else if (type === 'event') {
        if (!comment.likes.includes(authUser._id)) {
          await dispatch(eventCommentActions.likeComment(id));
        } else {
          await dispatch(eventCommentActions.unlikeComment(id));
        }
        await dispatch(eventActions.getEvent(itemId));
      }
    } catch (err) {
      setError(err.message);
    }
    setIsCommentLikeLoading(false);
  };

  const deleteCommentHandler = async (id, itemId) => {
    setError(null);
    setIsCommentDeleteLoading(true);
    try {
      if (type === 'event') {
        await dispatch(eventCommentActions.deleteComment(id, itemId));
        await dispatch(eventActions.getEvent(itemId));
      }
      if (type === 'ding') {
        await dispatch(commentActions.deleteComment(id, itemId));
        await dispatch(dingActions.getDing(itemId));
      }
    } catch (err) {
      setError(err.message);
    }
    setIsCommentDeleteLoading(false);
  };

  return (
    <View key={index} style={styles.outerCommentContainer}>
      <View style={styles.commentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.commentsUserName} onPress={onProfile}>
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
          {isCommentDeleteLoading ? (
            <View style={styles.commentLikeActInd}>
              <ActivityIndicator color={Colors.red} size="small" />
            </View>
          ) : (
            <Feather
              name="delete"
              color={Colors.gray}
              size={22}
              style={[styles.icon, { left: -4 }]}
              onPress={() => deleteCommentHandler(comment._id, item._id)}
            />
          )}
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
    top: 2,
  },
  miniLikesCount: {
    fontSize: 13,
    top: 1,
    fontFamily: 'cereal-book',
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
    width: 39,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#777',
  },
});

export default CustomComment;
