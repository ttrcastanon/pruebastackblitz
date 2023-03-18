import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Solicitud_de_VueloComponent } from './Solicitud_de_Vuelo-add-edit/Solicitud_de_Vuelo.component';
import { ListSolicitud_de_VueloComponent } from './list-Solicitud_de_Vuelo/list-Solicitud_de_Vuelo.component';
import { ShowAdvanceFilterSolicitud_de_VueloComponent } from './show-advance-filter-Solicitud_de_Vuelo/show-advance-filter-Solicitud_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListSolicitud_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'list/:phase',
    component: ListSolicitud_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Solicitud_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Solicitud_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Solicitud_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterSolicitud_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Solicitud_de_VueloRoutingModule {
}

