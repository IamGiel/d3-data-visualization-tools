import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }


  getCutomerOrder() {
    return this.firestore.collection('Customers').snapshotChanges();
  }
  getCutomerStat() {
    return this.firestore.collection('Health').snapshotChanges();
  }
}
