import { BaseModel } from "../_base/crud";

export class ItemMenu extends BaseModel {

    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    inventoryItems: Object[];
    createdBy: string;
    createdAt: number;
    updatedBy: string;
    updatedAt: number;

    toMap(): Object {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            categoryId: this.categoryId,
            inventoryItems: this.inventoryItems,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            updatedBy: this.updatedBy,
            updatedAt: this.updatedAt,
        }
    }

    fromMap(data: Object): ItemMenu {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
            this.description = data["description"];
            this.price = data["price"];
            this.categoryId = data["categoryId"];
            this.inventoryItems = data["inventoryItems"];
            this.createdBy = data["createdBy"];
            this.createdAt = data["createdAt"];
            this.updatedBy = data["updatedBy"];
            this.updatedAt = data["updatedAt"];
        }
        return this;
    }

    clear(): void {
        this.id = '';
        this.name = '';
        this.description = '';
        this.price = 0;
        this.categoryId = '';
        this.inventoryItems = [];
        this.createdBy = '';
        this.createdAt = 0;
        this.updatedBy = '';
        this.updatedAt = 0;
    }
}