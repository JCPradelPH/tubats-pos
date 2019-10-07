import { ModuleWithProviders, NgModule } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { InterceptService } from "../../../core/_base/crud";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatChipsModule, MatAutocompleteModule, MatSnackBarModule, MatDatepickerModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DeleteEntityDialogComponent } from "../../partials/content/crud";
import { PartialsModule } from "../../partials/partials.module";
import { ExpenseAndUtilityComponent } from "./expense-and-utility.component";
import { ExpenseAndUtilityListComponent } from "./expense-and-utility-list/expense-and-utility-list.component";
import { SetExpenseAndUtilityComponent } from "./set-expense-and-utility/set-expense-and-utility.component";

const routes: Routes = [
    {
        path: '',
        component: ExpenseAndUtilityComponent,
        children: [
            {
                path: '',
                component: ExpenseAndUtilityListComponent,
            },
            {
                path: 'expense-and-utility-list',
                component: ExpenseAndUtilityListComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'set-expense-and-utility',
                component: SetExpenseAndUtilityComponent,
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
        MatAutocompleteModule,
        MatChipsModule,
        MatSnackBarModule,
        MatDatepickerModule
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
    exports: [ExpenseAndUtilityComponent],
    entryComponents: [],
    declarations: [
        ExpenseAndUtilityComponent,
        ExpenseAndUtilityListComponent,
        SetExpenseAndUtilityComponent,
    ]
})

export class ExpenseAndUtilityModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ExpenseAndUtilityModule,
            providers: [

            ]
        };
    }
}