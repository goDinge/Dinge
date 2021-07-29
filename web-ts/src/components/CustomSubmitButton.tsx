import React from 'react';

interface button_props {
  buttonName: string;
  status: 'btn btn-primary' | 'btn btn-post-comment' | 'btn btn-edit-modal';
}

const CustomSubmitButton = (props: button_props) => {
  const { buttonName, status } = props;

  return <input type="submit" className={status} value={buttonName} />;
};

export default CustomSubmitButton;
