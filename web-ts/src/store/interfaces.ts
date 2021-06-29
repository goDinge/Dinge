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

export interface Get_Dinge {
  type: ActionTypes.GET_DINGE;
  payload: ding;
}

export interface Set_Message {
  type: ActionTypes.SET_MESSAGE;
  payload: string;
}

export interface Reset_Message {
  type: ActionTypes.RESET_MESSAGE;
  payload: string;
}

export type Action = Get_Dinge | Set_Message | Reset_Message;
