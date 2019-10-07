import { BaseModel } from "../../_base/crud";

export class Order extends BaseModel {

    id: string;
    total: number;
    amountTendered: number;
    change: number;
    createdBy: string;
    createdAt: number;
    updatedBy: string;
    updatedAt: number;
    transactionDate: number;
    readableTransactionDate: string;
    tableNumber: string;

    toMap(): Object {
        return {
            id: this.id,
            total: this.total,
            amountTendered: this.amountTendered,
            change: this.change,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            updatedBy: this.updatedBy,
            updatedAt: this.updatedAt,
            transactionDate: this.transactionDate,
            readableTransactionDate: this.readableTransactionDate,
            tableNumber: this.tableNumber,
        }
    }

    fromMap(data: Object): Order {
        if (data) {
            this.id = data["id"];
            this.total = data["total"];
            this.amountTendered = data["amountTendered"];
            this.change = data["change"];
            this.createdBy = data["createdBy"];
            this.createdAt = data["createdAt"];
            this.updatedBy = data["updatedBy"];
            this.updatedAt = data["updatedAt"];
            this.transactionDate = data["transactionDate"];
            this.readableTransactionDate = data["readableTransactionDate"];
            this.tableNumber = data["tableNumber"];
        }
        return this;
    }

    clear(): void {
        this.id = '';
        this.total = 0;
        this.amountTendered = 0;
        this.change = 0;
        this.createdBy = '';
        this.createdAt = 0;
        this.updatedBy = '';
        this.updatedAt = 0;
        this.transactionDate = 0;
        this.readableTransactionDate = '';
        this.tableNumber = '';
    }
}