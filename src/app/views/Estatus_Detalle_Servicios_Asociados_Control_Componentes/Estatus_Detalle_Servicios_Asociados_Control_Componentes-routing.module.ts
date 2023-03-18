import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_Detalle_Servicios_Asociados_Control_ComponentesComponent } from './Estatus_Detalle_Servicios_Asociados_Control_Componentes-add-edit/Estatus_Detalle_Servicios_Asociados_Control_Componentes.component';
import { ListEstatus_Detalle_Servicios_Asociados_Control_ComponentesComponent } from './list-Estatus_Detalle_Servicios_Asociados_Control_Componentes/list-Estatus_Detalle_Servicios_Asociados_Control_Componentes.component';



const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_Detalle_Servicios_Asociados_Control_ComponentesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_Detalle_Servicios_Asociados_Control_ComponentesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_Detalle_Servicios_Asociados_Control_ComponentesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_Detalle_Servicios_Asociados_Control_ComponentesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_Detalle_Servicios_Asociados_Control_ComponentesRoutingModule {
 }