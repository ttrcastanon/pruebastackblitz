import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Razon_de_Rechazo_a_AlmacenComponent } from './Razon_de_Rechazo_a_Almacen-add-edit/Razon_de_Rechazo_a_Almacen.component';
import { ListRazon_de_Rechazo_a_AlmacenComponent } from './list-Razon_de_Rechazo_a_Almacen/list-Razon_de_Rechazo_a_Almacen.component';
import { ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent } from './show-advance-filter-Razon_de_Rechazo_a_Almacen/show-advance-filter-Razon_de_Rechazo_a_Almacen.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListRazon_de_Rechazo_a_AlmacenComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Razon_de_Rechazo_a_AlmacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Razon_de_Rechazo_a_AlmacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Razon_de_Rechazo_a_AlmacenComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Razon_de_Rechazo_a_AlmacenRoutingModule {
 }

