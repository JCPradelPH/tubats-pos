import { createSelector } from "@ngrx/store";

export const selectMenuInventoryItemState = (state) => state.menuInventoryItem;

export const menuInventoryItem = createSelector(
    selectMenuInventoryItemState,
    menuInventoryItemState => menuInventoryItemState.menuInventoryItem
);