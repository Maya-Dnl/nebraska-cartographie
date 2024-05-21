import { createReducer, on } from "@ngrx/store";
import { AppState } from "./app.state";
import { TitleActions } from "./app.actions";

export const initialState: AppState = {
  title: ''
};

export const appReducer = createReducer (
  initialState,
  on(TitleActions.changeTitle, (state, { title }) => ({ ...state, title}))
);