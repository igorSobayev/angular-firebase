// Conexión a la bd de firebase

// Imports para las conexiones
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActionSequence } from 'protractor';
import { map } from 'rxjs/operators';

// Campos de la base de datos
export interface Item { name: string; }

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  constructor(private afs: AngularFirestore) {
    // esta variable va a traer una colección llamada items (nuestra tabla de la bd)
    this.itemsCollection = afs.collection<Item>('items');
    // capturamos todos los elementos
    // this.items = this.itemsCollection.valueChanges();
    // para traer el id de nuestro item
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  listaItem() {
    return this.items;
  }

  agregarItem(item: Item) {
    this.itemsCollection.add(item);
  }
}
