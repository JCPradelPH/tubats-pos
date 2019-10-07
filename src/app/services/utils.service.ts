import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	constructor() { }

	getParameterByName(name: string) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		const results: RegExpExecArray = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	mapObjectToPicklist(collection: any[], appendNameCol: string = undefined, otherFields: any[] = []) {
		return collection.map((row) => ({
			id: row["id"],
			name: `${row["name"]} ${appendNameCol !== undefined ? row[appendNameCol] : ""}`,
			selected: false,
			...otherFields.reduce((prev, val) => {
				prev[val] = row[val];
				return prev;
			}, {})
		}));
	}

	setPicklistData(value: string, list: Object[]): Object[] {
		return list.map((item) => {
			item["selected"] = value === item["id"];
			return item;
		});
	}

	getPicklistData(list: Object[]): any {
		return list.filter((item) => {
			return item["selected"];
		})[0];
	}

	getDateFromString(dateInStr: string = ''): Date {
		if (dateInStr && dateInStr.length > 0) {
			const dateParts = dateInStr.trim().split('/');
			const year = this.toInteger(dateParts[2]);
			const month = this.toInteger(dateParts[0]);
			const day = this.toInteger(dateParts[1]);
			// tslint:disable-next-line:prefer-const
			let result = new Date();
			result.setDate(day);
			result.setMonth(month - 1);
			result.setFullYear(year);
			return result;
		}

		return new Date();
	}

	toInteger(value: any): number {
		return parseInt(`${value}`, 10);
	}

	commaSeparated(amount: number) {
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	formatDate(date) {
		const monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		const day = date.getDate();
		const monthIndex = date.getMonth();
		const year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}

}
