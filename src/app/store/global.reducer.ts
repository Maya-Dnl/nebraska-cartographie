import { Action, createReducer, on } from "@ngrx/store";
import { GlobalActions } from "./global.actions";

export enum ApplicationMode {
  normalMode = 0,
  selectGpsPointMode = 1
}

export interface GlobalState {
  title: string;
  applicationMode: ApplicationMode;
}

export const initialState: GlobalState = {
  title: '',
  applicationMode: ApplicationMode.normalMode
};

export const globalReducer = createReducer (
  initialState,
  on(GlobalActions.changeTitle, (state, { newTitle }) => ({ ...state, title: newTitle})),
  on(GlobalActions.selectGpsPointMode, (state) => ({...state, applicationMode: ApplicationMode.selectGpsPointMode}))
);

