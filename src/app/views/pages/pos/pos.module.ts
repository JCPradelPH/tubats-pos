import { ModuleWithProviders, NgModule } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { InterceptService } from "../../../core/_base/crud";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatAutocompleteModule, MatChipsModule, MatSnackBar, MatSnackBarModule, MatDatepickerModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DeleteEntityDialogComponent } from "../../partials/content/crud";
import { PartialsModule } from "../../partials/partials.module";
import { PosComponent } from "./pos.component";
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';
import { POSReducer } from "../../../core/pos";
import { StoreModule } from "@ngrx/store";

const routes: Routes = [
    {
        path: '',
        component: PosComponent,
        children: [
            {
                path: '',
                component: PosComponent,
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
        MatDatepickerModule,
        StoreModule.forFeature('posSelector', POSReducer),
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
    exports: [PosComponent, CheckoutDialogComponent],
    entryComponents: [
        DeleteEntityDialogComponent,
        CheckoutDialogComponent
    ],
    declarations: [
        PosComponent,
        CheckoutDialogComponent,
    ]
})

export class POSModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: POSModule,
            providers: [

            ]
        };
    }
}