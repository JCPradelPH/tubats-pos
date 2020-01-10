import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentChangeAction, Action, DocumentSnapshot, QueryFn } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class FirestoreService {

	constructor(private firestore: AngularFirestore) { }

	setDocument(docRef: AngularFirestoreDocument<unknown>, model: any, isEditMode: boolean): Promise<any> {
		return isEditMode ? docRef.update(model.toMap()) : docRef.set(model.toMap());
	}

	getDocuments(collection: string): Observable<any> {
		return this.firestore.collection(collection, ref => ref.orderBy("updatedAt", "asc")).snapshotChanges().pipe(
			map(changes =>
				changes.map(c => (c.payload.doc.data()))
			)
		);
	}

	getDocumentsObs(collection: string,
		fieldPath: string | firebase.firestore.FieldPath,
		opStr: firebase.firestore.WhereFilterOp,
		value: any): Observable<any> {
		return this.firestore.collection(collection, ref => ref.where(fieldPath, opStr, value)).snapshotChanges().pipe(
			map(changes =>
				changes.map(c => (c.payload.doc.data()))
			)
		);
	}

	getDocumentById(collection: string, docId: string): Observable<any> {
		return this.firestore.collection(collection).doc(docId).snapshotChanges().pipe(
			map(changes =>
				changes.payload.data()
			)
		);
	}

	async getDocumentsPromise(collection: string): Promise<firebase.firestore.DocumentData[]> {
		const rows: firebase.firestore.QuerySnapshot = await this.firestore.collection(collection).ref.get();
		return rows.docs.map((value: firebase.firestore.QueryDocumentSnapshot) => value.data());
	}

	async getDocumentsByDate(collection: string, startTime: number, endTime: number): Promise<firebase.firestore.DocumentData[]> {
		const rows: firebase.firestore.QuerySnapshot = await this.firestore
			.collection(collection)
			.ref
			.where("transactionDate", ">=", startTime)
			.where("transactionDate", "<=", endTime)
			// .orderBy("transactionDate")
			// .startAt(startTime)
			// .endAt(endTime)
			.get();
		return rows.docs.map((value: firebase.firestore.QueryDocumentSnapshot) => value.data());
	}

	async getDocumentsOp(collection: string, 
		fieldPath: string | firebase.firestore.FieldPath, 
		opStr: firebase.firestore.WhereFilterOp, 
		value: any): Promise<firebase.firestore.DocumentData[]> {
		const rows: firebase.firestore.QuerySnapshot = await this.firestore
			.collection(collection)
			.ref
			.where(fieldPath, opStr, value)
			.get();
		return rows.docs.map((value: firebase.firestore.QueryDocumentSnapshot) => value.data());
	}

	async getDocumentByIdPromise(collection: string, docId: string): Promise<firebase.firestore.DocumentData> {
		const doc: firebase.firestore.DocumentSnapshot = await this.firestore.collection(collection).doc(docId).ref.get();
		return doc.data();
	}

	deleteDocument(collection: string, docId: string = undefined): Promise<void> {
		return this.firestore.collection(collection).doc(docId).delete();
	}

	deleteSubDocument(parentCollection: string, parentId: string, collection: string, docId: string = undefined): Promise<void> {
		return this.firestore.collection(parentCollection).doc(parentId).collection(collection).doc(docId).delete();
	}

	getDocumentByParentId(collection: string, filedName: string, parentId: string): Observable<any> {
		return this.firestore.collection(collection, ref => ref.where(filedName, '==', parentId)).snapshotChanges().pipe(
			map(changes =>
				changes.map(c => (c.payload.doc.data()))
			)
		);
	}
}
