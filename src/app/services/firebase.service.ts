import { Injectable } from '@angular/core';
import {
  getFirestore,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  WhereFilterOp,
} from 'firebase/firestore';
import { Subject } from 'rxjs';
import { uid } from 'uid';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}
  $createProject=new Subject()

  async addData<T>(col: string, data: T): Promise<T> {
    const db = getFirestore();
    return addDoc(collection(db, col), data) as any;
  }
  async getData<T>(col: string): Promise<T[]> {
    const db = getFirestore();
    return getDocs(collection(db, col)) as any;
  }
  async getDataById<T>(col: string, id: string): Promise<T> {
    const db = getFirestore();
    let docRef = doc(db, col, id);
    const docSnap = await getDoc(docRef);
    let returndata = docSnap.data() as any;
    returndata['id'] = docSnap.id;
    return returndata;
  }
  async getDataByFilter<T>(
    col: string,
    field: string,
    value: any,
    condition: WhereFilterOp
  ): Promise<T[]> {
    const db = getFirestore();
    const q = query(collection(db, col), where(field, condition, value));
    const querySnapshot = await getDocs(q);
    let data: any = [];
    querySnapshot.forEach((doc) => {
      let item = doc.data();
      item['id'] = doc.id;
      data.push(item);
    });
    return data;
  }
  async updateData<T>(col: string, data: T, id: string) {
    const db = getFirestore();
    let docRef = doc(db, col, id);
    const docSnap = await getDoc(docRef);
    return setDoc(docRef, data);
  }
  async deleteData<T>(col: string, id: string) {
    const db = getFirestore();
    let docRef = doc(db, col, id);
    const docSnap = await getDoc(docRef);
    return deleteDoc(docRef);
  }
  async getUser(id: string) {
    let user: any;
    const db = getFirestore();
    const q = query(collection(db, 'user'), where('uid', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      user = doc.data();
      user.id = doc.id;
    });
    return user;
  }
  getNewUid() {
    return uid();
  }
}
