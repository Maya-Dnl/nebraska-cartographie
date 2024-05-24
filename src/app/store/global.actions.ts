import { createAction, props } from "@ngrx/store";

export const changeTitle = createAction('[Title] Title changed !', props<{ newTitle: string }>());

export const GlobalActions = 
{
  changeTitle
}