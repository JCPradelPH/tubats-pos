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
import { MenuCategoryComponent } from "./menu-category.component";
import { MenuCategoryListComponent } from "./menu-category-list/menu-category-list.component";
import { SetMenuCategoryComponent } from "./set-menu-category/set-menu-category.component";

const routes: Routes = [
    {
        path: '',
        component: MenuCategoryComponent,
        children: [
            {
                path: '',
                component: MenuCategoryListComponent,
            },
            {
                path: 'menu-category-list',
                component: MenuCategoryListComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'set-menu-category',
                component: SetMenuCategoryComponent,
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
    exports: [MenuCategoryComponent],
    entryComponents: [
        DeleteEntityDialogComponent,
    ],
    declarations: [
        MenuCategoryComponent,
        MenuCategoryListComponent,
        SetMenuCategoryComponent,
    ]
})

export class MenuCategoryModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MenuCategoryModule,
            providers: [

            ]
        };
    }
}