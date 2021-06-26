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

export interface dinge_data {
  data: ding;
}

export interface Get_Dinge {
  type: ActionTypes.GET_DINGE;
  payload: ding;
}

export type Action = Get_Dinge;
