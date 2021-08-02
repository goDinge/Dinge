import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  userState,
  dingState,
  AuthState,
  messageState,
  locationState,
} from '../store/interfaces';
import { AppState } from '../store/reducers/rootReducer';

import * as dingActions from '../store/actions/ding';
import * as dingeActions from '../store/actions/dinge';
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
  const location: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationObj: GeolocationPosition = location.location;

  const messageScreenDing = 'ding';
  const messageScreenMap = 'map';

  const comments = dingObj.comments;

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
        dispatch(
          messageActions.setMessage(
            'Unable to load ding user',
            messageScreenDing
          )
        );
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

  //Ding
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
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
    setIsLikeLoading(false);
    await dispatch(dingActions.getDingById(dingId));
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
      dispatch(
        messageActions.setMessage('Description updated', messageScreenDing)
      );
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
    onChangeModalText('');
    setEditInitialText('');
    setIsEditLoading(false);
    setEditModal(false);
    cancelEditHandler();
  };

  const updatingText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText(e.target.value);
  };

  const updatingModalText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeModalText(e.target.value);
  };

  const openDingDeleteModalHandler = () => {
    dispatch(
      messageActions.setMessage(
        'Are you sure you want to delete this ding?',
        messageScreenDing
      )
    );
    //setModalMessage('ding');
    setDeleteDingModal(true);
  };

  const deleteDingHandler = async (dingId: string) => {
    setIsDeleting(true);
    try {
      await dispatch(dingeActions.deleteDingById(dingId));
      await dispatch(dingeActions.getLocalDinge(locationObj));
      setIsDeleting(false);
      closeDingHandler();
      await dispatch(
        messageActions.setMessage('Ding Deleted', messageScreenMap)
      );
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
  };

  const reportDingHandler = async (dingId: string) => {
    try {
      await dispatch(dingActions.reportDingById(dingId));
      dispatch(messageActions.setMessage('Ding Reported!', messageScreenDing));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
  };

  //Comments
  const postCommentHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    text: string,
    dingId: string
  ) => {
    e.preventDefault();
    if (!text) {
      dispatch(
        messageActions.setMessage('Please type something', messageScreenDing)
      );
      return;
    }
    setIsCommentLoading(true);
    try {
      await dispatch(commentActions.postComment(text, dingId));
      await dispatch(dingActions.getDingById(dingId));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
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
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
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
      dispatch(
        messageActions.setMessage('Comment reported!', messageScreenDing)
      );
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
  };

  //Modals
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
            type="ding"
            isLikeLoading={isLikeLoading}
            initLikeItem={initLikeDing}
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
                  type="ding"
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
          <CustomMessage
            overlay="message-ding-overlay"
            component="message-ding"
            item={dingObj}
            delete={deleteDingModal}
            isDeleting={isDeleting}
            onDelete={deleteDingHandler}
          />
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
