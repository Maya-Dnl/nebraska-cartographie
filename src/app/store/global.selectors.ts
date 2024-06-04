import { createSelector } from "@ngrx/store";
import { AppState } from "./app.state";
import { GlobalState } from "./global.reducer";


export const selectGlobal = (state: AppState) => state.global;

export const selectTitle = createSelector(selectGlobal, (state: GlobalState) => state.title)
export const selectApplicationMode = createSelector(selectGlobal, (state: GlobalState) => state.applicationMode)
export const selectUser = createSelector(selectGlobal, (state: GlobalState) => state.user)