import { ModuleWithProviders, NgModule } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { InterceptService } from "../../../core/_base/crud";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatChipsModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DeleteEntityDialogComponent } from "../../partials/content/crud";
import { PartialsModule } from "../../partials/partials.module";
import { ItemMenuComponent } from "./item-menu.component";
import { ItemMenuListComponent } from "./item-menu-list/item-menu-list.component";
import { SetItemMenuComponent } from "./set-item-menu/set-item-menu.component";
import { AddInventoryItemDialogComponent } from './add-inventory-item-dialog/add-inventory-item-dialog.component';
import { StoreModule } from "@ngrx/store";
import { menuInventoryItemReducer } from "../../../core/menu_inventory_item";

const routes: Routes = [
    {
        path: '',
        component: ItemMenuComponent,
        children: [
            {
                path: '',
                component: ItemMenuListComponent,
            },
            {
                path: 'item-menu-list',
                component: ItemMenuListComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'set-item-menu',
                component: SetItemMenuComponent,
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
        StoreModule.forFeature('menuInventoryItem', menuInventoryItemReducer),
        MatChipsModule
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
    exports: [ItemMenuComponent, AddInventoryItemDialogComponent],
    entryComponents: [
        DeleteEntityDialogComponent,
        AddInventoryItemDialogComponent
    ],
    declarations: [
        ItemMenuComponent,
        ItemMenuListComponent,
        SetItemMenuComponent,
        AddInventoryItemDialogComponent,
    ]
})

export class ItemMenuModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ItemMenuModule,
            providers: [

            ]
        };
    }
}