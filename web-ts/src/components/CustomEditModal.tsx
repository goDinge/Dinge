import React from 'react';
import { ding } from '../store/interfaces';
import CustomSubmitButton from './CustomSubmitButton';

const CustomEditModal = (props: {
  modalText: string;
  itemState: ding;
  isEditLoading: boolean;
  editInitialText: string;
  editCommentId: string;
  onText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (
    e: React.FormEvent<HTMLFormElement>,
    text: string,
    dingId: string
  ) => void;
  onCancel: () => void;
}) => {
  const {
    modalText,
    itemState,
    isEditLoading,
    editInitialText,
    editCommentId,
    onText,
    onEdit,
    onCancel,
  } = props;

  return (
    <div className="message-overlay">
      <div className="modal-ding">
        <p className="mb">Edit comment:</p>
        <form onSubmit={(e) => onEdit(e, editCommentId, itemState._id)}>
          <input
            className="comments-input"
            type="text"
            value={modalText}
            placeholder="write comment"
            onChange={(e) => onText(e)}
            defaultValue={editInitialText}
          />
          {isEditLoading ? (
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
        <button onClick={onCancel} className="btn btn-primary mb">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CustomEditModal;
