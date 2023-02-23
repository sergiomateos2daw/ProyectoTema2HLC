import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';


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

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router, public alertController: AlertController, private loadingController: LoadingController, private toastController: ToastController, private imagePicker: ImagePicker) { }

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

  async uploadImagePicker() {
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Espera porfavor...'
    });
    //Mensaje de finalizacion de subida de imagen
    const toast = await this.toastController.create({
      message: 'Imagen subida con éxito',
      duration: 3000
    });
    //Comprobar si la aplicacion tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        //Si no tiene permiso de lectura se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          //Abrir selector de imagenes
          this.imagePicker.getPictures({
            maximumImagesCount: 1, //Permite solo 1 imagen
            outputType: 1 //1 = Base64
          }).then(
            (results) => { // En la variable result tiene las imagenes seleccionadas
              //Carpeta del storage donde se almacenaran las imagenes
              let nombreCarpeta = 'imagenes';
              // Recorrer todas las imagenes que haya seleccionado el usuario
              // Aunque solo sea 1
              for(var i = 0; i<results.length; i++) {
                // Mostrar el mesaje de espera
                loading.present();
                // Asignar el nombre de la imagen en funcion de la hora actual
                //para evitar duplicados de nombres
                let nombreImagen = `${new Date().getTime()}`;
                //Llamar al metodo que sube la imagen al storage
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i]).then(
                  snapshot => {
                    snapshot.ref.getDownloadURL().then(
                      downloadURL => {
                        // En la varibale downloadURL esta la direccion de la imagen
                        console.log("downloadURL: " + downloadURL)
                        this.document.data.imagen = downloadURL;
                        // Mostrar el mensaje de finalizacion de la subida
                        toast.present();
                        // Ocultar imagen de espera
                        loading.dismiss();
                      }
                    )
                  }
                )
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err)
      }
    );
  }

  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'Archivo eliminado con éxito',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL).then(
      () => {
        toast.present();
      }, (err) => {
        console.log(err)
      }
    )
  }

}
