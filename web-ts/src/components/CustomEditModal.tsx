import React from 'react';
import { ding } from '../store/interfaces';
import CustomSubmitButton from './CustomSubmitButton';

const CustomEditModal = (props: {
  textType: string;
  modalText: string;
  itemState: ding;
  isEditLoading: boolean;
  editInitialText: string;
  editItemId: string;
  onText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (
    e: React.FormEvent<HTMLFormElement>,
    text: string,
    dingId: string
  ) => void;
  onCancel: () => void;
}) => {
  const {
    textType,
    modalText,
    itemState,
    isEditLoading,
    editInitialText,
    editItemId,
    onText,
    onEdit,
    onCancel,
  } = props;

  return (
    <div className="message-overlay">
      <div className="modal-ding">
        <p className="mb">Edit {textType}:</p>
        <form onSubmit={(e) => onEdit(e, editItemId, itemState._id)}>
          <input
            className="comments-input"
            type="text"
            value={modalText ? modalText : editInitialText}
            onChange={onText}
          />
          {isEditLoading ? (
            <CustomSubmitButton
              buttonName="Updating..."
              status="btn btn-edit-modal"
            />
          ) : (
            <CustomSubmitButton
              buttonName="Confirm Edit"
              status="btn btn-edit-modal"
            />
          )}
        </form>
        <button
          onClick={onCancel}
          className="btn btn-primary btn-edit-modal mb"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CustomEditModal;
