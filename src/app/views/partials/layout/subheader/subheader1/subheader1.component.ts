// Angular
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Layout
import { SubheaderService } from '../../../../../core/_base/layout';
import { Breadcrumb } from '../../../../../core/_base/layout/services/subheader.service';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-subheader1',
	templateUrl: './subheader1.component.html',
	styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {
	// Public properties
	today: number = Date.now();
	title: string = '';
	desc: string = '';
	breadcrumbs: Breadcrumb[] = [];

	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param subheaderService: SubheaderService
	 */
	constructor(public subheaderService: SubheaderService, private router: Router) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
			// breadcrumbs title sometimes can be undefined
			if (bt) {
				Promise.resolve(null).then(() => {
					this.title = bt.title;
					this.desc = bt.desc;
				});
			}
		}));

		this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
			Promise.resolve(null).then(() => {
				this.breadcrumbs = bc;
			});
		}));
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	createRecord() {
		console.log(this.title);
		if (this.title == 'Inventory') {
			this.router.navigateByUrl('inventory/set-inventory');
			return;
		}
		if (this.title == 'Menu Category') {
			this.router.navigateByUrl('menu-category/set-menu-category');
			return;
		}
		if (this.title == 'Item Menu') {
			this.router.navigateByUrl('item-menu/set-item-menu');
			return;
		}
		if (this.title == 'Recurring Expense') {
			this.router.navigateByUrl('recurring-expense/set-recurring-expense');
			return;
		}
		if (this.title == 'Expense and Utility') {
			this.router.navigateByUrl('expense-and-utility/set-expense-and-utility');
			return;
		}
	}
}
