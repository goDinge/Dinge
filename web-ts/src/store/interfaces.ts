//import { ReactElement } from 'hoist-non-react-statics/node_modules/@types/react';
import { ActionTypes } from './types';

export interface ding {
  description: string;
  _id: string;
  //dingType: string;
  likes: string[];
  comments: comment[];
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

export interface dingeState {
  dinge: [];
}

export interface dingState {
  ding: ding;
}

export interface userState {
  user: user;
}

export interface eventsState {
  events: [];
}

export interface locationState {
  location: {
    coords: location;
    timestamp: number;
  };
}

export type message = string;

export interface messageState {
  message: message;
  screen: string;
}

export interface itemObj {
  data: ding | event;
  lat: number;
  lng: number;
}

export type dinge = ding[];

export interface event {
  description: string;
  _id: string;
  //eventType: string;
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
  date: string;
  endDate: string;
  createdAt: Date;
  lastModifiedAt: Date;
}

export type events = event[];

export interface userObj {
  token: string;
  user: user;
  options: {
    expires: string;
  };
}

export interface user {
  avatar: string;
  role: string;
  reputation: number;
  level: string;
  status: string;
  facebook: string;
  following: [];
  followers: [];
  reports: string[];
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  lastLoginAt: string;
  lastModifiedAt: string;
}

export interface comment {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  likes: string[];
  dingId: string;
}

export interface location {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

export interface userData {
  data: {
    user: user;
  };
}

export interface AuthState {
  token: string | null;
  userId: string | null;
  didTryAutoLogin: boolean;
  authUser: user | null;
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

export interface formData {
  name: string;
  email: string;
  password: string;
  password2: string;
}

// xyz_data: the returned object from Axios calls, always inside a data object
// ie response = dinge.data.data
export interface dinge_data {
  data: dinge;
}

export interface ding_data {
  data: ding;
}

export interface events_data {
  data: events;
}

export interface comment_data {
  data: comment;
}

//Action Types
export interface Get_Dinge {
  type: ActionTypes.GET_DINGE;
  dinge: dinge;
}

export interface Get_Local_Dinge {
  type: ActionTypes.GET_LOCAL_DINGE;
  dinge: dinge;
}

export interface Get_Local_Events {
  type: ActionTypes.GET_LOCAL_EVENTS;
  events: events;
}

export interface Get_Dinge_By_Id {
  type: ActionTypes.GET_DING_BY_ID;
  ding: ding;
}

export interface Like_Ding {
  type: ActionTypes.LIKE_DING;
  ding: ding;
}

export interface Unlike_Ding {
  type: ActionTypes.UNLIKE_DING;
  ding: ding;
}

export interface Remove_Ding {
  type: ActionTypes.REMOVE_DING;
  ding: {};
}

export interface Report_Ding {
  type: ActionTypes.REPORT_DING;
  ding: ding;
}

export interface Delete_Ding_By_Id {
  type: ActionTypes.DELETE_DING_BY_ID;
  ding: {};
}

export interface Update_Ding_Description {
  type: ActionTypes.UPDATE_DING_DESCRIPTION;
  ding: ding;
}

export interface Get_User {
  type: ActionTypes.GET_USER;
  user: user;
}

export interface Remove_User {
  type: ActionTypes.REMOVE_USER;
  user: {};
}

export interface Post_Comment {
  type: ActionTypes.POST_COMMENT;
  comment: comment;
}

export interface Like_Comment {
  type: ActionTypes.LIKE_COMMENT;
  comment: comment;
}

export interface Unlike_Comment {
  type: ActionTypes.UNLIKE_COMMENT;
  comment: comment;
}

export interface Delete_Comment {
  type: ActionTypes.DELETE_COMMENT;
  comment: comment;
}

export interface Edit_Comment {
  type: ActionTypes.EDIT_COMMENT;
  comment: comment;
}

export interface Report_Comment {
  type: ActionTypes.REPORT_COMMENT;
  comment: comment;
}

export interface Set_Message {
  type: ActionTypes.SET_MESSAGE;
  message: string;
  screen: string;
}

export interface Reset_Message {
  type: ActionTypes.RESET_MESSAGE;
  message: '';
  screen: '';
}

export interface Authenticate {
  type: ActionTypes.AUTHENTICATE;
  userId: string;
  token: string;
  authUser: {
    name: string;
    email: string;
    password: string;
  };
}

export interface Set_Auth_User {
  type: ActionTypes.SET_AUTH_USER;
  userId: string;
  token: string;
  authUser: {
    name: string;
    email: string;
    password: string;
  };
}

export interface Get_Auth_User {
  type: ActionTypes.GET_AUTH_USER;
  userId: string;
  token: string;
  authUser: {
    name: string;
    email: string;
    password: string;
  };
}

export interface Set_Location {
  type: ActionTypes.SET_LOCATION;
  location: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  timestamp: number;
}

export interface Set_Did_Try_Al {
  type: ActionTypes.SET_DID_TRY_AL;
  didTryAutoLogin: boolean;
}

export interface Logout {
  type: ActionTypes.LOGOUT;
  didTryAutoLogin: boolean;
}

export type Marker = {
  lat: number;
  lng: number;
};

export type MessageActionTypes = Set_Message | Reset_Message;

export type AuthActionTypes =
  | Authenticate
  | Set_Auth_User
  | Get_Auth_User
  | Set_Did_Try_Al
  | Logout;

export type UserActionTypes = Get_User | Remove_User;

export type DingeActions = Get_Dinge | Get_Local_Dinge | Delete_Ding_By_Id;

export type DingActions =
  | Get_Dinge_By_Id
  | Remove_Ding
  | Like_Ding
  | Unlike_Ding
  | Report_Ding
  | Update_Ding_Description;

export type EventsActions = Get_Local_Events;

export type CommentsActions =
  | Post_Comment
  | Like_Comment
  | Unlike_Comment
  | Delete_Comment
  | Edit_Comment
  | Report_Comment;

export type LocationActions = Set_Location;
//export type DispatchActions = (dispatch: Dispatch<any>) => Promise<void>;
