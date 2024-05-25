import { createAction, props } from "@ngrx/store";

export const changeTitle = createAction('[Title] Title changed !', props<{ newTitle: string }>());
export const selectGpsPointMode = createAction('[Mode] Change mode to user select GPS !');

export const GlobalActions =
{
  changeTitle,
  selectGpsPointMode
}