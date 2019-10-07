import { ModuleWithProviders, NgModule } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { InterceptService } from "../../../core/_base/crud";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DeleteEntityDialogComponent } from "../../partials/content/crud";
import { PartialsModule } from "../../partials/partials.module";
import { RecurringExpenseListComponent } from "./recurring-expense-list/recurring-expense-list.component";
import { RecurringExpenseComponent } from "./recurring-expense.component";
import { SetRecurringExpenseComponent } from "./set-recurring-expense/set-recurring-expense.component";

const routes: Routes = [
    {
        path: '',
        component: RecurringExpenseComponent,
        children: [
            {
                path: '',
                component: RecurringExpenseListComponent,
            },
            {
                path: 'recurring-expense-list',
                component: RecurringExpenseListComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'set-recurring-expense',
                component: SetRecurringExpenseComponent,
            },
        ]
    }
];


@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        TranslateModule.forChild(),
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSortModule,
        PartialsModule,
    ],
    providers: [
        InterceptService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptService,
            multi: true
        },
        AngularFirestore
    ],
    exports: [RecurringExpenseComponent],
    entryComponents: [],
    declarations: [
        RecurringExpenseComponent,
        RecurringExpenseListComponent,
        SetRecurringExpenseComponent,
    ]
})

export class RecurringExpenseModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RecurringExpenseModule,
            providers: [

            ]
        };
    }
}