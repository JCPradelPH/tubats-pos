import { BaseModel } from "../../_base/crud";

export class MenuInventoryItem extends BaseModel {

    inventoryItemId: string;
    inventoryItemName: string;
    inventoryItemUnitId: string;
    inventoryItemUnitName: string;
    quantity: number;

    toMap(): Object {
        return {
            inventoryItemId: this.inventoryItemId,
            inventoryItemName: this.inventoryItemName,
            inventoryItemUnitId: this.inventoryItemUnitId,
            inventoryItemUnitName: this.inventoryItemUnitName,
            quantity: this.quantity,
        }
    }

    fromMap(data: Object): MenuInventoryItem {
        if (data) {
            this.inventoryItemId = data["inventoryItemId"];
            this.inventoryItemName = data["inventoryItemName"];
            this.inventoryItemUnitId = data["inventoryItemUnitId"];
            this.inventoryItemUnitName = data["inventoryItemUnitName"];
            this.quantity = data["quantity"];
        }
        return this;
    }

    clear(): void {
        this.inventoryItemId = '';
        this.inventoryItemName = '';
        this.inventoryItemUnitId = '';
        this.inventoryItemUnitName = '';
        this.quantity = 0;
    }
}