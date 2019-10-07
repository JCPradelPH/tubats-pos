// Actions
import { MenuInventoryItemActions, MenuInventoryItemActionTypes } from '../_actions/menu-inventory-item.actions';
// Models
import { MenuInventoryItem } from '../_models/menu-inventory-item.model';

export interface MenuInventoryItemState {
    menuInventoryItem: MenuInventoryItem;
}

export const initialMenuInventoryItemState: MenuInventoryItemState = {
    menuInventoryItem: undefined,
};

export function menuInventoryItemReducer(state = initialMenuInventoryItemState, action: MenuInventoryItemActions): MenuInventoryItemState {
    switch (action.type) {
        case MenuInventoryItemActionTypes.AddMenuInventoryItem: {
            const _menuInventoryItem: MenuInventoryItem = action.payload.menuInventoryItem;
            return {
                ...state,
                menuInventoryItem: _menuInventoryItem,
            };
        }

        default:
            return state;
    }
}
