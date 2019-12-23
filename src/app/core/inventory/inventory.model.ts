import { BaseModel } from "../_base/crud";

export class Inventory extends BaseModel {

    id: string;
    name: string;
    stock: number;
    minimumStockAllowed: number;
    isLowOnStock: boolean;
    unitId: string;
    createdBy: string;
    updatedBy: string;
    createdAt: number;
    updatedAt: number;

    toMap(): Object {
        return {
            id: this.id,
            name: this.name,
            stock: this.stock,
            minimumStockAllowed: this.minimumStockAllowed,
            isLowOnStock: this.isLowOnStock,
            unitId: this.unitId,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    fromMap(data: Object): Inventory {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
            this.stock = data["stock"];
            this.minimumStockAllowed = data["minimumStockAllowed"];
            this.isLowOnStock = data["isLowOnStock"];
            this.unitId = data["unitId"];
            this.createdBy = data["createdBy"];
            this.updatedBy = data["updatedBy"];
            this.createdAt = data["createdAt"];
            this.updatedAt = data["updatedAt"];
        }
        return this;
    }

    clear(): void {
        this.id = '';
        this.name = '';
        this.stock = 0;
        this.minimumStockAllowed = 0;
        this.isLowOnStock = false;
        this.unitId = '';
        this.createdBy = '';
        this.updatedBy = '';
        this.createdAt = 0;
        this.updatedAt = 0;
    }
}