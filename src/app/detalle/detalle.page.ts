import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  tareaEditando: Tarea;

  document: any = {
    id: "",
    data: {} as Tarea
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.firestoreService.consultarPorId("datos", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Tarea;
      } 
    });
  }

  clickBotonEliminar() {
    this.firestoreService.borrar("datos", this.id).then(() => {
    })
    this.router.navigate(['/home']);
  }

  clicBotonModificar() {
    console.log(this.id)
    this.firestoreService.actualizar("datos", this.id, this.document.data).then(() => {
      console.log(this.document.data)
    })
    this.router.navigate(['/home']);
  }

 

}
