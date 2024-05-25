import { Action, createReducer, on } from "@ngrx/store";
import { GlobalActions, userLogInSuccess } from "./global.actions";
import firebase from 'firebase/compat/app';

import UserCredential = firebase.auth.UserCredential;

export enum ApplicationMode {
  normalMode = 0,
  selectGpsPointMode = 1
}

export interface GlobalState {
  title: string;
  applicationMode: ApplicationMode;
  user: firebase.User | null;
}

export const initialState: GlobalState = {
  title: '',
  applicationMode: ApplicationMode.normalMode,
  user: null
};

export const globalReducer = createReducer (
  initialState,
  on(GlobalActions.changeTitle, (state, { newTitle }) => ({ ...state, title: newTitle})),
  on(GlobalActions.selectGpsPointMode, (state) => ({...state, applicationMode: ApplicationMode.selectGpsPointMode})),
  on(GlobalActions.userLogInSuccess, (state, { user }) => ({...state, user: user})),
  on(GlobalActions.userLogOutSuccess, (state) => ({...state, user: null, applicationMode: ApplicationMode.normalMode}))
);
