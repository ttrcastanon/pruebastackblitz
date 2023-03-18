import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Solicitud_de_partes_materiales_y_herramientasComponent } from './Solicitud_de_partes_materiales_y_herramientas-add-edit/Solicitud_de_partes_materiales_y_herramientas.component';
import { ListSolicitud_de_partes_materiales_y_herramientasComponent } from './list-Solicitud_de_partes_materiales_y_herramientas/list-Solicitud_de_partes_materiales_y_herramientas.component';
import { ShowAdvanceFilterSolicitud_de_partes_materiales_y_herramientasComponent } from './show-advance-filter-Solicitud_de_partes_materiales_y_herramientas/show-advance-filter-Solicitud_de_partes_materiales_y_herramientas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSolicitud_de_partes_materiales_y_herramientasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Solicitud_de_partes_materiales_y_herramientasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Solicitud_de_partes_materiales_y_herramientasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Solicitud_de_partes_materiales_y_herramientasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSolicitud_de_partes_materiales_y_herramientasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Solicitud_de_partes_materiales_y_herramientasRoutingModule {
 }

