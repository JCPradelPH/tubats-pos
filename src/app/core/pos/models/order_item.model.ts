import { BaseModel } from "../../_base/crud";

export class OrderItem extends BaseModel {

    id: string;
    itemId: string;
    itemName: string;
    itemDescription: string;
    itemCategory: string;
    orderId: string;
    itemCategoryId: string;
    menuInventoryItems: Object[];
    itemPrice: number;
    totalPrice: number;
    quantity: number;

    toMap(): Object {
        return {
            id: this.id,
            itemId: this.itemId,
            itemName: this.itemName,
            itemDescription: this.itemDescription,
            itemCategory: this.itemCategory,
            orderId: this.orderId,
            itemCategoryId: this.itemCategoryId,
            menuInventoryItems: this.menuInventoryItems,
            itemPrice: this.itemPrice,
            totalPrice: this.totalPrice,
            quantity: this.quantity,
        }
    }

    fromMap(data: Object): OrderItem {
        if (data) {
            this.id = data["id"];
            this.itemId = data["itemId"];
            this.itemName = data["itemName"];
            this.itemDescription = data["itemDescription"];
            this.itemCategory = data["itemCategory"];
            this.orderId = data["orderId"];
            this.itemCategoryId = data["itemCategoryId"];
            this.menuInventoryItems = data["menuInventoryItems"];
            this.itemPrice = data["itemPrice"];
            this.totalPrice = data["totalPrice"];
            this.quantity = data["quantity"];
        }
        return this;
    }

    clear(): void {
        this.id = '';
        this.itemName = '';
        this.itemDescription = '';
        this.itemCategoryId = '';
        this.itemCategory = '';
        this.orderId = '';
        this.menuInventoryItems = [];
        this.itemPrice = 0;
        this.totalPrice = 0;
        this.quantity = 0;
    }
}