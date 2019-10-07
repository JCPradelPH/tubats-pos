import { BaseModel } from "../_base/crud";

export class ExpenseAndUtility extends BaseModel {

    id: string = "";
    name: string = "";
    description: string = "";
    expenseCategoryId: string = "";
    inventoryItemId: string = "";
    recurringExpenseId: string = "";
    inventoryItemQuantity: number = 0;
    inventoryItemUnitName: string = '';
    amount: number = 0;
    createdBy: string = "";
    updatedBy: string = "";
    createdAt: number = 0;
    updatedAt: number = 0;
    transactionDate: number = 0;
    readableTransactionDate: string = '';

    toMap(): Object {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            expenseCategoryId: this.expenseCategoryId,
            inventoryItemId: this.inventoryItemId,
            recurringExpenseId: this.recurringExpenseId,
            inventoryItemQuantity: this.inventoryItemQuantity,
            inventoryItemUnitName: this.inventoryItemUnitName,
            amount: this.amount,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            transactionDate: this.transactionDate,
            readableTransactionDate: this.readableTransactionDate,
        }
    }

    fromMap(data: Object): ExpenseAndUtility {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
            this.description = data["description"];
            this.expenseCategoryId = data["expenseCategoryId"];
            this.inventoryItemId = data["inventoryItemId"];
            this.recurringExpenseId = data["recurringExpenseId"];
            this.inventoryItemQuantity = data["inventoryItemQuantity"];
            this.inventoryItemUnitName = data["inventoryItemUnitName"];
            this.amount = data["amount"];
            this.createdBy = data["createdBy"];
            this.updatedBy = data["updatedBy"];
            this.createdAt = data["createdAt"];
            this.updatedAt = data["updatedAt"];
            this.transactionDate = data["transactionDate"];
            this.readableTransactionDate = data["readableTransactionDate"];
        }
        return this;
    }

    clear(): void {
        this.id = '';
        this.name = '';
        this.description = '';
        this.expenseCategoryId = '';
        this.inventoryItemId = '';
        this.recurringExpenseId = '';
        this.inventoryItemUnitName = '';
        this.inventoryItemQuantity = 0;
        this.amount = 0;
        this.createdBy = '';
        this.updatedBy = '';
        this.createdAt = 0;
        this.updatedAt = 0;
        this.transactionDate = 0;
        this.readableTransactionDate = '';
    }
}