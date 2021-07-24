import React from 'react';
import { ding } from '../store/interfaces';
import CustomSubmitButton from './CustomSubmitButton';

const CustomCommentInput = (props: {
  itemState: ding;
  text: string;
  isCommentLoading: boolean;
  onText: any;
  onComment: (
    e: React.FormEvent<HTMLFormElement>,
    text: string,
    dingId: string
  ) => void;
}) => {
  const { itemState, text, isCommentLoading, onText, onComment } = props;

  return (
    <div className="custom-socials-container">
      <div className="custom-socials">
        <form onSubmit={(e) => onComment(e, text, itemState._id)}>
          <input
            className="comments-input"
            type="text"
            value={text}
            placeholder="write comment"
            onChange={(e) => onText(e)}
          />
          {isCommentLoading ? (
            <CustomSubmitButton
              buttonName="Posting..."
              status="btn btn-post-comment"
            />
          ) : (
            <CustomSubmitButton
              buttonName="Post"
              status="btn btn-post-comment"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default CustomCommentInput;
