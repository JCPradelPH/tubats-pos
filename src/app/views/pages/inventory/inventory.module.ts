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
import { InventoryComponent } from "./inventory.component";
import { InventoryListComponent } from "./inventory-list/inventory-list.component";
import { SetInventoryComponent } from "./set-inventory/set-inventory.component";

const routes: Routes = [
    {
        path: '',
        component: InventoryComponent,
        children: [
            {
                path: '',
                component: InventoryListComponent,
            },
            {
                path: 'inventory-list',
                component: InventoryListComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'set-inventory',
                component: SetInventoryComponent,
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
    exports: [InventoryComponent],
    entryComponents: [
        DeleteEntityDialogComponent,
    ],
    declarations: [
        InventoryComponent,
        InventoryListComponent,
        SetInventoryComponent,
    ]
})

export class InventoryModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: InventoryModule,
            providers: [

            ]
        };
    }
}