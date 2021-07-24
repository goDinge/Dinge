import React from 'react';

interface button_props {
  buttonName: string;
  status: 'btn btn-primary' | 'btn btn-post-comment';
}

const CustomButton = (props: button_props) => {
  const { buttonName, status } = props;

  return <input type="submit" className={status} value={buttonName} />;
};

export default CustomButton;
