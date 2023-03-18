import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Control_de_Calibracion_de_Equipo_y_HerramientaComponent } from './Control_de_Calibracion_de_Equipo_y_Herramienta-add-edit/Control_de_Calibracion_de_Equipo_y_Herramienta.component';
import { ListControl_de_Calibracion_de_Equipo_y_HerramientaComponent } from './list-Control_de_Calibracion_de_Equipo_y_Herramienta/list-Control_de_Calibracion_de_Equipo_y_Herramienta.component';

const routes: Routes = [
  {
    path: 'list',
     component: ListControl_de_Calibracion_de_Equipo_y_HerramientaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Control_de_Calibracion_de_Equipo_y_HerramientaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Control_de_Calibracion_de_Equipo_y_HerramientaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Control_de_Calibracion_de_Equipo_y_HerramientaComponent,
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


export class Control_de_Calibracion_de_Equipo_y_HerramientaRoutingModule {
 }

