import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { user, ding, comment } from '../store/interfaces';

import { FaRegThumbsUp } from 'react-icons/fa';
import { FiEdit, FiFlag } from 'react-icons/fi';
import { RiDeleteBack2Line } from 'react-icons/ri';
import { Colors } from '../constants/Colors';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import * as commentActions from '../store/actions/comment';
import * as eventCommentActions from '../store/actions/eventComment';
import * as dingActions from '../store/actions/ding';
import * as eventActions from '../store/actions/event';
import * as messageActions from '../store/actions/message';

const CustomComment = (props: {
  type: 'ding' | 'event';
  comment: comment;
  authUser: user | null;
  item: ding;
  onEditor: (id: string, text: string) => void;
  onFlag: (id: string) => void;
}) => {
  const { type, comment, authUser, item, onEditor, onFlag } = props;

  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [isCommentDeleteLoading, setIsCommentDeleteLoading] = useState(false);

  const dispatch = useDispatch<Dispatch<any>>();

  const messageScreen = 'ding';
  const comments = item.comments;

  let likesCountStyle: string;
  if (type === 'ding') {
    likesCountStyle = 'comment-likes-count';
  } else {
    likesCountStyle = 'event-comment-likes-count';
  }

  const likeCommentHandler = async (id: string, itemId: string) => {
    setIsCommentLikeLoading(true);
    const comment = comments.find((comment) => comment._id === id);
    try {
      if (type === 'ding') {
        if (authUser && comment && !comment.likes.includes(authUser._id)) {
          await dispatch(commentActions.likeComment(id));
        } else {
          await dispatch(commentActions.unlikeComment(id));
        }
        await dispatch(dingActions.getDingById(itemId));
      } else {
        if (authUser && comment && !comment.likes.includes(authUser._id)) {
          await dispatch(eventCommentActions.likeComment(id));
        } else {
          await dispatch(eventCommentActions.unlikeComment(id));
        }
        await dispatch(eventActions.getEventById(itemId));
      }
    } catch (err) {
      messageActions.setMessage(err.message, messageScreen);
    }
    setIsCommentLikeLoading(false);
  };

  const deleteCommentHandler = async (id: string, itemId: string) => {
    setIsCommentDeleteLoading(true);
    try {
      if (type === 'ding') {
        await dispatch(commentActions.deleteComment(id, itemId));
        await dispatch(dingActions.getDingById(itemId));
      } else {
        await dispatch(eventCommentActions.deleteComment(id, itemId));
        await dispatch(eventActions.getEventById(itemId));
      }
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreen));
    }
  };

  return (
    <div className="comment-outer-container">
      <div className="comment-container">
        <div className="comment-text-container">
          <p className="comment-username">{comment.userName}</p>
          <p className="description">{comment.text}</p>
        </div>
        <div className={likesCountStyle}>
          <FaRegThumbsUp size={19} color="black" style={{ padding: 3 }} />
          <p className="comment-likes-count-text">{comment.likes.length}</p>
        </div>
      </div>
      {comment.userId === authUser?._id ? (
        <div className="comments-icon-container">
          <FiEdit
            size={20}
            color={Colors.grey}
            style={{ cursor: 'pointer' }}
            onClick={() => onEditor(comment._id, comment.text)}
          />
          {isCommentDeleteLoading ? (
            <div className="spinner-margin-left">
              <Loader
                type="Oval"
                color={Colors.primary}
                height={20}
                width={20}
              />
            </div>
          ) : (
            <RiDeleteBack2Line
              size={20}
              color={Colors.grey}
              style={{ marginLeft: 5, cursor: 'pointer' }}
              onClick={() => deleteCommentHandler(comment._id, item._id)}
            />
          )}
        </div>
      ) : authUser && comment.likes.includes(authUser._id) ? (
        <div className="comments-icon-container">
          {isCommentLikeLoading ? (
            <Loader type="Oval" color={Colors.primary} height={20} width={20} />
          ) : (
            <FaRegThumbsUp
              size={20}
              color={Colors.primary}
              style={{ cursor: 'pointer' }}
              onClick={() => likeCommentHandler(comment._id, item._id)}
            />
          )}
          <FiFlag
            size={20}
            color={Colors.grey}
            style={{ marginLeft: 5, cursor: 'pointer' }}
            onClick={() => onFlag(comment._id)}
          />
        </div>
      ) : (
        <div className="comments-icon-container">
          {isCommentLikeLoading ? (
            <Loader type="Oval" color={Colors.primary} height={20} width={20} />
          ) : (
            <FaRegThumbsUp
              size={20}
              color={Colors.grey}
              style={{ cursor: 'pointer' }}
              onClick={() => likeCommentHandler(comment._id, item._id)}
            />
          )}
          <FiFlag
            size={20}
            color={Colors.grey}
            style={{ marginLeft: 5, cursor: 'pointer' }}
            onClick={() => onFlag(comment._id)}
          />
        </div>
      )}
    </div>
  );
};

export default CustomComment;
