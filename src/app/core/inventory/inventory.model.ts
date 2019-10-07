import { BaseModel } from "../_base/crud";

export class Inventory extends BaseModel {

    id: string;
    name: string;
    stock: number;
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
        this.unitId = '';
        this.createdBy = '';
        this.updatedBy = '';
        this.createdAt = 0;
        this.updatedAt = 0;
    }
}