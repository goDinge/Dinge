import React from 'react';
import { user, ding, comment } from '../store/interfaces';

const CustomComment = (props: {
  comment: comment;
  authUser: user | null;
  item: ding;
}) => {
  const { comment, authUser, item } = props;

  return (
    <div>
      <p>{comment.text}</p>
    </div>
  );
};

export default CustomComment;
