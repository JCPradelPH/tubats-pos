// Actions
import { POSActions, POSActionTypes } from '../_actions/pos.actions';
// Models

export interface POSState {
    paymentSucceeded: boolean;
}

export const initialPOSState: POSState = {
    paymentSucceeded: false,
};

export function POSReducer(state = initialPOSState, action: POSActions): POSState {
    switch (action.type) {
        case POSActionTypes.SetPaymenSucceededStatus: {
            const paymentStatus: boolean = action.payload.paymentSucceeded;
            return {
                ...state,
                paymentSucceeded: paymentStatus,
            };
        }

        default:
            return state;
    }
}
