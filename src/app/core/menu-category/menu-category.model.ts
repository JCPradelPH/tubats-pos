import { BaseModel } from "../_base/crud";

export class MenuCategory extends BaseModel {

    id: string;
    name: string;
    createdBy: string;
    updatedBy: string;
    createdAt: number;
    updatedAt: number;

    toMap(): Object {
        return {
            id: this.id,
            name: this.name,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    fromMap(data: Object): MenuCategory {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
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
        this.createdBy = '';
        this.updatedBy = '';
        this.createdAt = 0;
        this.updatedAt = 0;
    }
}