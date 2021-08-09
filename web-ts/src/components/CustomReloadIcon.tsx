import React, { useState, useEffect } from 'react';
import reload from '../assets/reload.png';

const CustomReloadIcon = (props: { onSelect: () => void }) => {
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    window.addEventListener('animationend', rotatingDone);
  });

  const rotatingDone = () => {
    setRotate(false);
  };

  return (
    <div className="reload-container" onClick={props.onSelect}>
      <img
        alt="reload"
        className={rotate ? 'rotate' : ''}
        src={reload}
        onClick={() => setRotate(true)}
      />
    </div>
  );
};

export default CustomReloadIcon;
