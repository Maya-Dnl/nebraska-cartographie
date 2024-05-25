import { createAction, props } from "@ngrx/store";
import firebase from 'firebase/compat/app';


import UserCredential = firebase.auth.UserCredential;

export const changeTitle = createAction('[Title] Title changed !', props<{ newTitle: string }>());
export const selectGpsPointMode = createAction('[Mode] Change mode to user select GPS !');
export const userLogInSuccess = createAction('[userLogInSuccess] User login is successfull', props<{user: firebase.User}>())
export const userLogOutSuccess = createAction('[userLogOutSuccess] User logout is successfull');

export const GlobalActions =
{
  changeTitle,
  selectGpsPointMode,
  userLogInSuccess,
  userLogOutSuccess
}