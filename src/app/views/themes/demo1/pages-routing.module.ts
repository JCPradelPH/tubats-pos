// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard } from '../../../core/auth';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: 'app/views/pages/dashboard/dashboard.module#DashboardModule'
			},
			{
				path: 'builder',
				loadChildren: 'app/views/themes/demo1/content/builder/builder.module#BuilderModule'
			},
			{ path: 'inventory', loadChildren: 'app/views/pages/inventory/inventory.module#InventoryModule' },
			{ path: 'menu-category', loadChildren: 'app/views/pages/menu-category/menu-category.module#MenuCategoryModule' },
			{ path: 'item-menu', loadChildren: 'app/views/pages/item-menu/item-menu.module#ItemMenuModule' },
			{ path: 'recurring-expense', loadChildren: 'app/views/pages/recurring-expense/recurring-expense.module#RecurringExpenseModule' },
			{ path: 'expense-and-utility', loadChildren: 'app/views/pages/expense-and-utility/expense-and-utility.module#ExpenseAndUtilityModule' },
			{ path: 'pos', loadChildren: 'app/views/pages/pos/pos.module#POSModule' },
			{ path: 'pos-transactions', loadChildren: 'app/views/pages/pos-transactions/pos-transactions.module#POSTransactionsModule' },
			{ path: 'low-stocks', loadChildren: 'app/views/pages/low-stocks/low-stocks.module#LowStocksModule' },
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
