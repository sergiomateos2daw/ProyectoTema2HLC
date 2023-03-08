import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

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
  document: any = {
    id: "",
    data: {} as Tarea
  };
  constructor(private firestoreService: FirestoreService, private router: Router, private callNumber: CallNumber, private socialSharing: SocialSharing) {
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

  clickBotonNuevo(){
    this.router.navigate(['/detalle', "nuevo"]);
  }

  idTareaSelec: string;

  selecTarea(tareaSelec) {
    console.log("Tarea seleccionada: ");
    console.log(tareaSelec);
    this.idTareaSelec = tareaSelec.id;
    console.log(tareaSelec.id)
    this.router.navigate(['/detalle', this.idTareaSelec]);
  }

  clickBotonEliminar() {
    this.firestoreService.borrar("datos", this.idTareaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
    })
  }
  clicBotonModificar() {
    console.log(this.idTareaSelec);
    this.firestoreService.actualizar("datos", this.idTareaSelec, this.tareaEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
    })
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

  llamar(){

    this.callNumber.callNumber("651065453", true)
    .then(res => console.log('Llamada realizada', res))
    .catch(err => console.log('Error en realizar la llamada', err));
  }
  
  compartir() {
    const options = {
      message: 'Hola esto es compartir con SocialSharing',
      chooserTitle: 'Compartir con...'
    };

    this.socialSharing.shareWithOptions(options)
      .then(() => {
        console.log('Mensaje compartido correctamente');
      }).catch((error) => {
        console.log('Error al compartir el mensaje: ', error);
      });
  }
}