import { createAction, props } from "@ngrx/store";
import { UserModel } from "./models/user.model";

export const changeTitle = createAction('[Title] Title changed !', props<{ newTitle: string }>());
export const selectGpsPointMode = createAction('[Mode] Change mode to user select GPS !');
export const userLogInSuccess = createAction('[userLogInSuccess] User login is successfull', props<{user: UserModel}>())
export const userLogOutSuccess = createAction('[userLogOutSuccess] User logout is successfull');

export const GlobalActions =
{
  changeTitle,
  selectGpsPointMode,
  userLogInSuccess,
  userLogOutSuccess
}