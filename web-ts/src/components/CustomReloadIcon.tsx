import React from 'react';
import reload from '../assets/reload.png';

const CustomReloadIcon = (props: { onSelect: () => void }) => {
  return (
    <div className="reload-container" onClick={props.onSelect}>
      <img alt="reload" src={reload} />
    </div>
  );
};

export default CustomReloadIcon;
