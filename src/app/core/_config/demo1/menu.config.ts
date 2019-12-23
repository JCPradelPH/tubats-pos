export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			'items': [
				{
					title: "TUBATS Restobar POS"
				}
			]
		},
		aside: {
			self: {},
			items: [
				{ section: 'Point of Sales' },
				{
					title: 'Dashboard',
					root: true,
					icon: 'flaticon-diagram',
					page: '/dashboard',
					bullet: 'dot',
				},
				{
					title: 'POS',
					root: true,
					icon: 'flaticon2-shopping-cart',
					page: '/pos',
					bullet: 'dot',
				},
				{
					title: 'POS Transactions',
					root: true,
					icon: 'flaticon-list',
					page: '/pos-transactions',
					bullet: 'dot',
				},
				{ section: 'Menu Management' },
				{
					title: 'Menu Category',
					root: true,
					icon: 'flaticon-tabs',
					page: '/menu-category',
					bullet: 'dot',
				},
				{
					title: 'Item Menu',
					root: true,
					icon: 'flaticon-list-2',
					page: '/item-menu',
					bullet: 'dot',
				},
				{ section: 'Inventory and Expenses' },
				{
					title: 'Inventory',
					root: true,
					icon: 'flaticon-open-box',
					page: '/inventory',
					bullet: 'dot',
				},
				{
					title: 'Low Stocks',
					root: true,
					icon: 'flaticon-danger',
					page: '/low-stocks',
					bullet: 'dot',
				},
				{
					title: 'Recurring Expense',
					root: true,
					icon: 'flaticon2-calendar-4',
					page: '/recurring-expense',
					bullet: 'dot',
				},
				{
					title: 'Expense and Utility',
					root: true,
					icon: 'flaticon2-analytics',
					page: '/expense-and-utility',
					bullet: 'dot',
				},
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
