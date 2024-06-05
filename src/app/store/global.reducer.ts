import { Action, createReducer, on } from "@ngrx/store";
import { GlobalActions, userLogInSuccess } from "./global.actions";
import { UserModel } from "./models/user.model";

export enum ApplicationMode {
  normalMode = 0,
  GpsPointMode = 1
}

export interface GlobalState {
  title: string;
  applicationMode: ApplicationMode;
  user: UserModel | null;
}

export const initialState: GlobalState = {
  title: '',
  applicationMode: ApplicationMode.normalMode,
  user: null
};

export const globalReducer = createReducer (
  initialState,
  on(GlobalActions.changeTitle, (state, { newTitle }) => ({ ...state, title: newTitle, applicationMode: ApplicationMode.normalMode})),
  on(GlobalActions.activeGpsPointMode, (state) => ({...state, applicationMode: ApplicationMode.GpsPointMode})),
  on(GlobalActions.userLogInSuccess, (state, { user }) => ({...state, user: user})),
  on(GlobalActions.userLogOutSuccess, (state) => ({...state, user: null, applicationMode: ApplicationMode.normalMode}))
);
