import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, private angularFireStorage: AngularFireStorage) { }
  public insertar(coleccion, datos){
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(collection){
    return this.angularFirestore.collection(collection).snapshotChanges();
  }

  public borrar(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion, documentId, datos) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
  }

  public consultarPorId(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  public uploadImage(nombreCarpeta, nombreArchivo, imagenBase64) {
    let storageRef = 
    this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString("data:image/jpeg;base64,"+imagenBase64, 'data_url');
  }

  public deleteFileFromURL(fileURL) {
    return this.angularFireStorage.storage.refFromURL(fileURL).delete();
  }
  
}