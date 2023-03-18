import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Configuracion_de_Politicas_de_ViaticosComponent } from './Configuracion_de_Politicas_de_Viaticos-add-edit/Configuracion_de_Politicas_de_Viaticos.component';
import { ListConfiguracion_de_Politicas_de_ViaticosComponent } from './list-Configuracion_de_Politicas_de_Viaticos/list-Configuracion_de_Politicas_de_Viaticos.component';
import { ShowAdvanceFilterConfiguracion_de_Politicas_de_ViaticosComponent } from './show-advance-filter-Configuracion_de_Politicas_de_Viaticos/show-advance-filter-Configuracion_de_Politicas_de_Viaticos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConfiguracion_de_Politicas_de_ViaticosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Configuracion_de_Politicas_de_ViaticosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Configuracion_de_Politicas_de_ViaticosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Configuracion_de_Politicas_de_ViaticosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConfiguracion_de_Politicas_de_ViaticosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Configuracion_de_Politicas_de_ViaticosRoutingModule {
 }

