import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  userState,
  dingState,
  AuthState,
  messageState,
} from '../store/interfaces';
import { AppState } from '../store/reducers/rootReducer';

import * as dingActions from '../store/actions/ding';
//import * as dingeActions from '../store/actions/dinge';
import * as userActions from '../store/actions/user';
import * as commentActions from '../store/actions/comment';
import * as messageActions from '../store/actions/message';

import CustomSocials from './CustomSocials';
import CustomCommentInput from './CustomCommentInput';
import CustomComment from './CustomComment';
import CustomMessage from './CustomMessage';
import CustomEditModal from './CustomEditModal';
import xMark from '../assets/x-mark.png';

const CustomDing = () => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = auth.authUser;
  const ding: dingState = useSelector((state: AppState) => state.ding);
  const dingObj = ding.ding;
  const user: userState = useSelector((state: AppState) => state.user);
  const userObj = user.user;
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;

  const comments = dingObj.comments;

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [text, onChangeText] = useState('');
  const [modalText, onChangeModalText] = useState('');
  const [commentOrDescription, setCommentOrDescription] = useState<
    'comment' | 'description'
  >('comment');
  const [editDingId, setEditDingId] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState('');
  const [editInitialText, setEditInitialText] = useState('');
  const [deleteDingModal, setDeleteDingModal] = useState(false);

  const dispatch = useDispatch<Dispatch<any>>();

  const loadUser = useCallback(
    async (userId: string) => {
      try {
        await dispatch(userActions.getUser(userId));
      } catch (err) {
        dispatch(messageActions.setMessage('Unable to load ding user'));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadUser(dingObj.user);
  }, [dingObj.user, loadUser]);

  let initLikeDing = false;
  if (dingObj.likes && authUser !== null) {
    if (dingObj.likes.includes(authUser._id)) {
      initLikeDing = true;
    }
  }

  //Like and Unlike
  const likeDingHandler = async (dingId: string) => {
    setIsLikeLoading(true);
    try {
      if (initLikeDing) {
        initLikeDing = false;
        await dispatch(dingActions.unlikeDing(dingId));
      } else {
        initLikeDing = true;
        await dispatch(dingActions.likeDing(dingId));
      }
    } catch (err) {
      dispatch(messageActions.setMessage(err.message));
    }
    setIsLikeLoading(false);
    await dispatch(dingActions.getDingById(dingId));
  };

  const updatingText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText(e.target.value);
  };

  const updatingModalText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeModalText(e.target.value);
  };

  const openDingDeleteModalHandler = () => {
    dispatch(
      messageActions.setMessage('Are you sure you want to delete this ding?')
    );
    //setModalMessage('ding');
    setDeleteDingModal(true);
  };

  // const deleteDingHandler = async (dingId: string) => {
  //   setIsDeleting(true);
  //   try {
  //     await dispatch(dingeActions.deleteDingById(dingId)); //possible to fix reducer so no need to call getLocalDinge for a fresh state?
  //     await dispatch(dingeActions.getLocalDinge(locationState));
  //     await setConfirmDelete(false);
  //     dispatch(messageActions.setMessage('Ding Deleted'));
  //   } catch (err) {
  //     dispatch(messageActions.setMessage(err.message));
  //   }
  //   setIsDeleting(false);
  // };

  //Comments
  const postCommentHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    text: string,
    dingId: string
  ) => {
    e.preventDefault();
    if (!text) {
      dispatch(messageActions.setMessage('Please type something'));
      return;
    }
    setIsCommentLoading(true);
    try {
      await dispatch(commentActions.postComment(text, dingId));
      await dispatch(dingActions.getDingById(dingId));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message));
    }
    onChangeText('');
    setIsCommentLoading(false);
  };

  const editCommentHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
    dingId: string
  ) => {
    e.preventDefault();
    setIsEditLoading(true);
    try {
      await dispatch(commentActions.editComment(modalText, id));
      await dispatch(dingActions.getDingById(dingId));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message));
    }
    onChangeModalText('');
    setEditInitialText('');
    setIsEditLoading(false);
    setEditModal(false);
    cancelEditHandler();
  };

  const reportCommentHandler = async (id: string) => {
    try {
      await dispatch(commentActions.reportComment(id));
      dispatch(messageActions.setMessage('Comment reported!'));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message));
    }
  };

  const editDescriptionHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    dingId: string
  ) => {
    e.preventDefault();

    setIsEditLoading(true);
    try {
      await dispatch(dingActions.updateDingDescription(modalText, dingId));
      await dispatch(dingActions.getDingById(dingId));
      //await dispatch(dingeActions.getLocalDinge(location)); //not sure why this is needed atm
      dispatch(messageActions.setMessage('Description updated'));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message));
    }
    onChangeModalText('');
    setEditInitialText('');
    setIsEditLoading(false);
    setEditModal(false);
    cancelEditHandler();
  };

  const openEditorHandler = (id: string, text: string) => {
    setCommentOrDescription('comment');
    setEditModal(true);
    setEditCommentId(id);
    setEditInitialText(text);
  };

  const openUpdateDescriptionHandler = (id: string, text: string) => {
    setCommentOrDescription('description');
    setEditModal(true);
    setEditDingId(id);
    setEditInitialText(text);
  };

  const cancelEditHandler = () => {
    setEditModal(false);
    setEditInitialText('');
  };

  //Report Ding
  const reportDingHandler = async (dingId: string) => {
    try {
      await dispatch(dingActions.reportDingById(dingId));
      dispatch(messageActions.setMessage('Ding Reported!'));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message));
    }
  };

  const closeDingHandler = () => {
    dispatch(dingActions.removeDing());
    dispatch(userActions.removeUser());
    dispatch(messageActions.resetMessage());
  };

  return (
    <div className="ding-overlay">
      <div className="close-ding" onClick={() => closeDingHandler()}>
        <img alt="close" src={xMark} />
      </div>
      <div className="ding-container">
        <div className="dingImg">
          <img alt="ding" src={dingObj.imgUrl} />
        </div>
        <div className="ding-right-container">
          <CustomSocials
            isLikeLoading={isLikeLoading}
            initLikeDing={initLikeDing}
            authUser={authUser}
            itemState={dingObj}
            user={userObj}
            onEditor={openUpdateDescriptionHandler}
            onLike={likeDingHandler}
            onFlag={reportDingHandler}
            onDelete={openDingDeleteModalHandler}
          />
          <CustomCommentInput
            itemState={dingObj}
            text={text}
            isCommentLoading={isCommentLoading}
            onText={updatingText}
            onComment={postCommentHandler}
          />
          {comments &&
            comments.map((item, index) => {
              return (
                <CustomComment
                  key={index}
                  comment={item}
                  authUser={authUser}
                  item={dingObj}
                  onEditor={openEditorHandler}
                  onFlag={reportCommentHandler}
                />
              );
            })}
        </div>
        {messageStr ? (
          <CustomMessage component="message-ding" delete={deleteDingModal} />
        ) : null}
        {editModal ? (
          <CustomEditModal
            textType={commentOrDescription}
            modalText={modalText}
            itemState={dingObj}
            isEditLoading={isEditLoading}
            editInitialText={editInitialText}
            editItemId={
              commentOrDescription === 'comment' ? editCommentId : editDingId
            }
            onText={updatingModalText}
            onEdit={
              commentOrDescription === 'comment'
                ? editCommentHandler
                : editDescriptionHandler
            }
            onCancel={cancelEditHandler}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CustomDing;
