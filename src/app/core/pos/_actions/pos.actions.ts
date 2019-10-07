import { Action } from '@ngrx/store';

export enum POSActionTypes {
    SetPaymenSucceededStatus = '[SetSuccessStatus] Action',
}

export class SetPaymenSucceededStatus implements Action {
    readonly type = POSActionTypes.SetPaymenSucceededStatus;
    constructor(public payload: { paymentSucceeded: boolean }) { }
}

export type POSActions = SetPaymenSucceededStatus;