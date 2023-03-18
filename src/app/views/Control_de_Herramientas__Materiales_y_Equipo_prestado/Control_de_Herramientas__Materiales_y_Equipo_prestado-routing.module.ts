import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Control_de_Herramientas__Materiales_y_Equipo_prestadoComponent } from './Control_de_Herramientas__Materiales_y_Equipo_prestado-add-edit/Control_de_Herramientas__Materiales_y_Equipo_prestado.component';
import { ListControl_de_Herramientas__Materiales_y_Equipo_prestadoComponent } from './list-Control_de_Herramientas__Materiales_y_Equipo_prestado/list-Control_de_Herramientas__Materiales_y_Equipo_prestado.component';

const routes: Routes = [
  {
    path: 'list',
     component: ListControl_de_Herramientas__Materiales_y_Equipo_prestadoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Control_de_Herramientas__Materiales_y_Equipo_prestadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Control_de_Herramientas__Materiales_y_Equipo_prestadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Control_de_Herramientas__Materiales_y_Equipo_prestadoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Control_de_Herramientas__Materiales_y_Equipo_prestadoRoutingModule {
 }

