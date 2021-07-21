import React from 'react';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { FiEdit, FiFlag } from 'react-icons/fi';
import { RiDeleteBin2Line } from 'react-icons/ri';

import { Colors } from '../constants/Colors';

const CustomSocials = () => {
  return (
    <div className="custom-socials">
      <div className="icon-container">
        <div className="icon-left-container">
          <FaRegThumbsUp
            size={24}
            color={Colors.primary}
            style={{ marginRight: 8 }}
          />
          <p>2</p>
        </div>
        <div className="icon-right-container">
          <FiEdit size={24} color="black" style={{ marginRight: 8 }} />
          <RiDeleteBin2Line size={24} color="black" />
        </div>
      </div>
    </div>
  );
};

export default CustomSocials;
