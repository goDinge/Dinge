import React from 'react';
import { button_props } from '../store/interfaces';

const CustomButton = (props: button_props) => {
  const { buttonName } = props;

  return <input type="submit" className="btn btn-primary" value={buttonName} />;
};

export default CustomButton;
