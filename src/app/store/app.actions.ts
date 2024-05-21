import { createAction, props } from "@ngrx/store";

export const changeTitle = createAction('[Title] Title changed !', props<{ title: string }>());

export const TitleActions = 
{
  changeTitle
}