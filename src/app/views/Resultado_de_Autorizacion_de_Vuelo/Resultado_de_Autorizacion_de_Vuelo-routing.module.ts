import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Resultado_de_Autorizacion_de_VueloComponent } from './Resultado_de_Autorizacion_de_Vuelo-add-edit/Resultado_de_Autorizacion_de_Vuelo.component';
import { ListResultado_de_Autorizacion_de_VueloComponent } from './list-Resultado_de_Autorizacion_de_Vuelo/list-Resultado_de_Autorizacion_de_Vuelo.component';
import { ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent } from './show-advance-filter-Resultado_de_Autorizacion_de_Vuelo/show-advance-filter-Resultado_de_Autorizacion_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListResultado_de_Autorizacion_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Resultado_de_Autorizacion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Resultado_de_Autorizacion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Resultado_de_Autorizacion_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Resultado_de_Autorizacion_de_VueloRoutingModule {
 }

