import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Servicios_Herramientas_Adicionales_A_SolicitarComponent } from './Servicios_Herramientas_Adicionales_A_Solicitar-add-edit/Servicios_Herramientas_Adicionales_A_Solicitar.component';
import { ListServicios_Herramientas_Adicionales_A_SolicitarComponent } from './list-Servicios_Herramientas_Adicionales_A_Solicitar/list-Servicios_Herramientas_Adicionales_A_Solicitar.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListServicios_Herramientas_Adicionales_A_SolicitarComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Servicios_Herramientas_Adicionales_A_SolicitarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Servicios_Herramientas_Adicionales_A_SolicitarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Servicios_Herramientas_Adicionales_A_SolicitarComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Servicios_Herramientas_Adicionales_A_SolicitarRoutingModule {
 }

