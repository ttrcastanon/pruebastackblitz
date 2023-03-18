import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Autorizacion_de_Prefactura_AerovicsComponent } from './Autorizacion_de_Prefactura_Aerovics-add-edit/Autorizacion_de_Prefactura_Aerovics.component';
import { ListAutorizacion_de_Prefactura_AerovicsComponent } from './list-Autorizacion_de_Prefactura_Aerovics/list-Autorizacion_de_Prefactura_Aerovics.component';
import { ShowAdvanceFilterAutorizacion_de_Prefactura_AerovicsComponent } from './show-advance-filter-Autorizacion_de_Prefactura_Aerovics/show-advance-filter-Autorizacion_de_Prefactura_Aerovics.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAutorizacion_de_Prefactura_AerovicsComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
     component: ListAutorizacion_de_Prefactura_AerovicsComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Autorizacion_de_Prefactura_AerovicsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Autorizacion_de_Prefactura_AerovicsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Autorizacion_de_Prefactura_AerovicsComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAutorizacion_de_Prefactura_AerovicsComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Autorizacion_de_Prefactura_AerovicsRoutingModule {
 }

