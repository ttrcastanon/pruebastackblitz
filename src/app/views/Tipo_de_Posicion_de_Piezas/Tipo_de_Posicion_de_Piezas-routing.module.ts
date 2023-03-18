import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Posicion_de_PiezasComponent } from './Tipo_de_Posicion_de_Piezas-add-edit/Tipo_de_Posicion_de_Piezas.component';
import { ListTipo_de_Posicion_de_PiezasComponent } from './list-Tipo_de_Posicion_de_Piezas/list-Tipo_de_Posicion_de_Piezas.component';
import { ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent } from './show-advance-filter-Tipo_de_Posicion_de_Piezas/show-advance-filter-Tipo_de_Posicion_de_Piezas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Posicion_de_PiezasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Posicion_de_PiezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Posicion_de_PiezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Posicion_de_PiezasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Posicion_de_PiezasRoutingModule {
 }

