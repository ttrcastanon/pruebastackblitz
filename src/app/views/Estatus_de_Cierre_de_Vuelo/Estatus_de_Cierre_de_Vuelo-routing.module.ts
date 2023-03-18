import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_Cierre_de_VueloComponent } from './Estatus_de_Cierre_de_Vuelo-add-edit/Estatus_de_Cierre_de_Vuelo.component';
import { ListEstatus_de_Cierre_de_VueloComponent } from './list-Estatus_de_Cierre_de_Vuelo/list-Estatus_de_Cierre_de_Vuelo.component';
import { ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent } from './show-advance-filter-Estatus_de_Cierre_de_Vuelo/show-advance-filter-Estatus_de_Cierre_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_Cierre_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_Cierre_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_Cierre_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_Cierre_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_Cierre_de_VueloRoutingModule {
 }

