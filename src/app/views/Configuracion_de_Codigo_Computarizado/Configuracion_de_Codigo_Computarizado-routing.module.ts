import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Configuracion_de_Codigo_ComputarizadoComponent } from './Configuracion_de_Codigo_Computarizado-add-edit/Configuracion_de_Codigo_Computarizado.component';
import { ListConfiguracion_de_Codigo_ComputarizadoComponent } from './list-Configuracion_de_Codigo_Computarizado/list-Configuracion_de_Codigo_Computarizado.component';
import { ShowAdvanceFilterConfiguracion_de_Codigo_ComputarizadoComponent } from './show-advance-filter-Configuracion_de_Codigo_Computarizado/show-advance-filter-Configuracion_de_Codigo_Computarizado.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConfiguracion_de_Codigo_ComputarizadoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Configuracion_de_Codigo_ComputarizadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Configuracion_de_Codigo_ComputarizadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Configuracion_de_Codigo_ComputarizadoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConfiguracion_de_Codigo_ComputarizadoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Configuracion_de_Codigo_ComputarizadoRoutingModule {
 }

