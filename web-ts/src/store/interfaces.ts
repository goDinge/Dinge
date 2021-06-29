import { ActionTypes } from './types';

export interface ding {
  description: string;
  dingType: string;
  likes: string[];
  comments: string[];
  reports: string[];
  user: string;
  location: {
    longitude: number;
    latitude: number;
  };
  thumbUrl: string;
  imgUrl: string;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface customInputProps {
  type: string;
  id: string;
  placeholder: string;
  onInputChange: any;
  initialValue?: string | boolean;
  isValid?: boolean;
  initiallyValid?: boolean;
  required?: boolean;
  email?: string;
  facebook?: string;
  min?: number;
  max?: number;
  minLength?: number;
}

export interface button_props {
  buttonName: string;
}

export interface formData {
  name?: string;
  email: string;
  password: string;
  password2?: string;
}

export interface dinge_data {
  data: ding;
}

export interface Message {
  id: string;
  messageType: string;
  text: string;
}

//Action Types

export interface Get_Dinge {
  type: ActionTypes.GET_DINGE;
  payload: ding;
}

export interface Add_Message {
  type: ActionTypes.ADD_MESSAGE;
  message: {
    message: string;
    messageType: string;
    id: string;
  };
}

export interface Remove_Message {
  type: ActionTypes.REMOVE_MESSAGE;
  message: string;
}

export type MessageActions = Add_Message | Remove_Message;

export type DingeActions = Get_Dinge;
