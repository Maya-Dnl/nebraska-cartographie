import { Action, createReducer, on } from "@ngrx/store";
import { GlobalActions } from "./global.actions";

export interface GlobalState {
  title: string;
}

export const initialState: GlobalState = {
  title: ''
};

export const globalReducer = createReducer (
  initialState,
  on(GlobalActions.changeTitle, (state, { newTitle }) => ({ ...state, title: newTitle}))
);