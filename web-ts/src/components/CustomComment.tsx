import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { user, ding, comment } from '../store/interfaces';

import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { FiEdit, FiFlag } from 'react-icons/fi';
import { RiDeleteBack2Line } from 'react-icons/ri';
import { Colors } from '../constants/Colors';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import CustomError from './CustomError';
import * as commentActions from '../store/actions/comment';
import * as dingActions from '../store/actions/ding';

const CustomComment = (props: {
  comment: comment;
  authUser: user | null;
  item: ding;
}) => {
  const { comment, authUser, item } = props;

  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [isCommentDeleteLoading, setIsCommentDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<Dispatch<any>>();

  const comments = item.comments;

  const likeCommentHandler = async (id: string, itemId: string) => {
    setError('testing error component');
    setIsCommentLikeLoading(true);
    const comment = comments.find((comment) => comment._id === id);
    try {
      if (authUser && comment && !comment.likes.includes(authUser._id)) {
        await dispatch(commentActions.likeComment(id));
      } else {
        await dispatch(commentActions.unlikeComment(id));
      }
      await dispatch(dingActions.getDing(itemId));
    } catch (err) {
      setError(err.message);
    }
    setIsCommentLikeLoading(false);
  };

  const deleteCommentHandler = async (id: string, itemId: string) => {
    setError(null);
    setIsCommentDeleteLoading(true);
    try {
      await dispatch(commentActions.deleteComment(id, itemId));
      await dispatch(dingActions.getDing(itemId));
    } catch (err) {
      setError(err.message);
    }
    setIsCommentDeleteLoading(false);
  };

  const onClose = () => {
    setError(null);
  };

  return (
    <div className="comment-outer-container">
      <div className="comment-container">
        <div className="comment-text-container">
          <p className="comment-username">{comment.userName}</p>
          <p className="description">{comment.text}</p>
        </div>
        <div className="comment-likes-count">
          <FaRegThumbsUp
            size={20}
            color="black"
            style={{ padding: 3, cursor: 'pointer' }}
          />
          <p className="comment-likes-count-text">{comment.likes.length}</p>
        </div>
      </div>
      {comment.userId === authUser?._id ? (
        <div className="comments-icon-container">
          <FiEdit size={20} color={Colors.grey} style={{ cursor: 'pointer' }} />
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
          />
        </div>
      )}
      {error ? (
        <CustomError
          message={error}
          onClose={onClose}
          errorType="error-comment"
        />
      ) : null}
    </div>
  );
};

export default CustomComment;
