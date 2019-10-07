import { createSelector } from "@ngrx/store";

export const selectPOSState = (state) => state.posSelector;

export const posSelector = createSelector(
    selectPOSState,
    posState => posState.pos
);