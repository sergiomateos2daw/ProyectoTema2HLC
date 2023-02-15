import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  tareaEditando: Tarea;
  isNew: boolean;

  document: any = {
    id: "",
    data: {} as Tarea
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router, public alertController: AlertController) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id === 'nuevo') {
      this.isNew = true;
    } else {
      this.isNew = false;
    }
    console.log("Prueba")
    this.firestoreService.consultarPorId("datos", this.id).subscribe((resultado) => {
      console.log("Despues")
      // Preguntar si se hay encontrado un document con ese ID
      if (resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.nombre);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Tarea;
      }
    });
  }

  async clickBotonEliminar() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de que desea borrar este personaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.firestoreService.borrar("datos", this.id).then(() => {
              this.router.navigate(['/home']);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  clicBotonModificar() {
    if (this.isNew) {
      this.firestoreService.insertar("datos", this.document.data).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      this.firestoreService.actualizar("datos", this.id, this.document.data).then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

 

}
