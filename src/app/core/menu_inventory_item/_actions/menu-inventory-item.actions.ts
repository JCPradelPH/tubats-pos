import { Action } from '@ngrx/store';
import { MenuInventoryItem } from '../_models/menu-inventory-item.model';

export enum MenuInventoryItemActionTypes {
    AddMenuInventoryItem = '[AddMenuInventoryItem] Action',
}

export class AddMenuInventoryItem implements Action {
    readonly type = MenuInventoryItemActionTypes.AddMenuInventoryItem;
    constructor(public payload: { menuInventoryItem: MenuInventoryItem }) { }
}

export type MenuInventoryItemActions = AddMenuInventoryItem;