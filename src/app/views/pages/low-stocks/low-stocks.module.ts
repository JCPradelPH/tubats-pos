import { ModuleWithProviders, NgModule } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { InterceptService } from "../../../core/_base/crud";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PartialsModule } from "../../partials/partials.module";
import { LowStocksComponent } from "./low-stocks.component";
import { LowStocksListComponent } from "./low-stocks-list/low-stocks-list.component";

const routes: Routes = [
    {
        path: '',
        component: LowStocksComponent,
        children: [
            {
                path: '',
                component: LowStocksListComponent,
            },
            {
                path: 'low-stocks',
                component: LowStocksListComponent,
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
    exports: [LowStocksComponent],
    entryComponents: [
    ],
    declarations: [
        LowStocksComponent,
        LowStocksListComponent,
    ]
})

export class LowStocksModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LowStocksModule,
            providers: [

            ]
        };
    }
}