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
import { PosTransactionsComponent } from "./pos-transactions.component";
import { PosTransactionsListComponent } from "./pos-transactions-list/pos-transactions-list.component";

const routes: Routes = [
    {
        path: '',
        component: PosTransactionsComponent,
        children: [
            {
                path: '',
                component: PosTransactionsListComponent,
            },
            {
                path: 'pos-transactions-list',
                component: PosTransactionsListComponent,
                data: { returnUrl: window.location.pathname }
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
    exports: [PosTransactionsComponent],
    entryComponents: [
        DeleteEntityDialogComponent,
    ],
    declarations: [
        PosTransactionsComponent,
        PosTransactionsListComponent,
    ]
})

export class POSTransactionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: POSTransactionsModule,
            providers: [

            ]
        };
    }
}