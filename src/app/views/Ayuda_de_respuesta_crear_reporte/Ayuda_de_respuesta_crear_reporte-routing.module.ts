import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Ayuda_de_respuesta_crear_reporteComponent } from './Ayuda_de_respuesta_crear_reporte-add-edit/Ayuda_de_respuesta_crear_reporte.component';
import { ListAyuda_de_respuesta_crear_reporteComponent } from './list-Ayuda_de_respuesta_crear_reporte/list-Ayuda_de_respuesta_crear_reporte.component';
import { ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent } from './show-advance-filter-Ayuda_de_respuesta_crear_reporte/show-advance-filter-Ayuda_de_respuesta_crear_reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAyuda_de_respuesta_crear_reporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Ayuda_de_respuesta_crear_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Ayuda_de_respuesta_crear_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Ayuda_de_respuesta_crear_reporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Ayuda_de_respuesta_crear_reporteRoutingModule {
 }

