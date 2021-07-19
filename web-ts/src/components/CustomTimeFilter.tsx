import React from 'react';

const CustomTimeFilter = (props: {
  name: string;
  text: string;
  timeSelected: string;
  onSelect: () => void;
}) => {
  const { name, text, timeSelected, onSelect } = props;

  return name === timeSelected ? (
    <div className="time-icon-selected" onClick={onSelect}>
      <div className="button-container">
        <p className="icon-text-selected">{text}</p>
      </div>
    </div>
  ) : (
    <div className="time-icon" onClick={onSelect}>
      <div className="button-container">
        <p className="icon-text">{text}</p>
      </div>
    </div>
  );
};

export default CustomTimeFilter;
