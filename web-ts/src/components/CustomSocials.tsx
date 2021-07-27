import React, { useState } from 'react';
import { ding, user } from '../store/interfaces';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { FiEdit, FiFlag } from 'react-icons/fi';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { Colors } from '../constants/Colors';
import { timeConverter } from '../helpers/timeConverter';

const CustomSocials = (props: {
  isLikeLoading: boolean;
  initLikeDing: boolean;
  itemState: ding;
  user: user;
  authUser: user | null;
  onLike: (dingId: string) => Promise<void>;
  onFlag: (dingId: string) => Promise<void>;
}) => {
  const {
    isLikeLoading,
    initLikeDing,
    itemState,
    user,
    authUser,
    onLike,
    onFlag,
  } = props;

  const [description, setDescription] = useState(itemState.description);

  return (
    <div className="custom-socials-container">
      <div className="custom-socials">
        <div className="icon-container">
          <div className="icon-left-container">
            {isLikeLoading ? (
              <div className="spinner-margin">
                <Loader
                  type="Oval"
                  color={Colors.primary}
                  height={20}
                  width={20}
                />
              </div>
            ) : initLikeDing ? (
              <FaThumbsUp
                size={24}
                color={Colors.primary}
                style={{ marginRight: 8 }}
                onClick={() => onLike(itemState._id)}
              />
            ) : (
              <FaRegThumbsUp
                size={24}
                color="black"
                style={{ marginRight: 8 }}
                onClick={() => onLike(itemState._id)}
              />
            )}
            <p className="likes-count">
              {itemState.likes && itemState.likes.length}
            </p>
          </div>
          {authUser && user && authUser._id === user._id ? (
            <div className="icon-right-container">
              <FiEdit size={24} color="black" style={{ marginRight: 8 }} />
              <RiDeleteBin2Line size={24} color="black" />
            </div>
          ) : (
            <div className="icon-right-container">
              <FiFlag
                size={24}
                color="black"
                onClick={() => onFlag(itemState._id)}
              />
            </div>
          )}
        </div>
        <div className="social-profile">
          <div className="name-time-container">
            <p className="user-name">{user.name}</p>
            <p className="time-text">{timeConverter(itemState.createdAt)}</p>
          </div>
          <p className="description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomSocials;