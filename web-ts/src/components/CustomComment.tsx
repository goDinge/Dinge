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
import * as dingActions from '../store/actions/ding';
import * as messageActions from '../store/actions/message';

const CustomComment = (props: {
  comment: comment;
  authUser: user | null;
  item: ding;
  onEditor: (id: string, text: string) => void;
  onFlag: (id: string) => void;
}) => {
  const { comment, authUser, item, onEditor, onFlag } = props;

  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [isCommentDeleteLoading, setIsCommentDeleteLoading] = useState(false);

  const messageScreen = 'ding';

  const dispatch = useDispatch<Dispatch<any>>();

  const comments = item.comments;

  const likeCommentHandler = async (id: string, itemId: string) => {
    setIsCommentLikeLoading(true);
    const comment = comments.find((comment) => comment._id === id);
    try {
      if (authUser && comment && !comment.likes.includes(authUser._id)) {
        await dispatch(commentActions.likeComment(id));
      } else {
        await dispatch(commentActions.unlikeComment(id));
      }
      await dispatch(dingActions.getDingById(itemId));
    } catch (err) {
      messageActions.setMessage(err.message, messageScreen);
    }
    setIsCommentLikeLoading(false);
  };

  const deleteCommentHandler = async (id: string, itemId: string) => {
    setIsCommentDeleteLoading(true);
    try {
      await dispatch(commentActions.deleteComment(id, itemId));
      await dispatch(dingActions.getDingById(itemId));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreen));
    }
    setIsCommentDeleteLoading(false);
  };

  return (
    <div className="comment-outer-container">
      <div className="comment-container">
        <div className="comment-text-container">
          <p className="comment-username">{comment.userName}</p>
          <p className="description">{comment.text}</p>
        </div>
        <div className="comment-likes-count">
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
