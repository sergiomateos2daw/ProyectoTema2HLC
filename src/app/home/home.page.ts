import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tareaEditando: Tarea;
  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Tarea
  }];
  constructor(private firestoreService: FirestoreService) {
    // Crear una tarea vacia al empezar
    this.tareaEditando = {} as Tarea;

    this.obtenerListaTareas();
  }

  clickBotonInsertar(){
    this.firestoreService.insertar("datos",this.tareaEditando)
    .then(()=>{
      console.log("Tarea creada correctamente");
      this.tareaEditando = {} as Tarea;
    },(error) =>{
      console.error(error)
    });
  }

  obtenerListaTareas(){
    this.firestoreService.consultar("datos").subscribe((resultadoConsultaTareas) => {
      this.arrayColeccionTareas = [];
      resultadoConsultaTareas.forEach((datosTareas: any) => {
        this.arrayColeccionTareas.push({
          id: datosTareas.payload.doc.id,
          data: datosTareas.payload.doc.data()
        })
      })
    }
    )
  }
}