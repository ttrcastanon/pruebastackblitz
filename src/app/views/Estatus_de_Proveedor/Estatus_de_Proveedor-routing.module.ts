import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_ProveedorComponent } from './Estatus_de_Proveedor-add-edit/Estatus_de_Proveedor.component';
import { ListEstatus_de_ProveedorComponent } from './list-Estatus_de_Proveedor/list-Estatus_de_Proveedor.component';
import { ShowAdvanceFilterEstatus_de_ProveedorComponent } from './show-advance-filter-Estatus_de_Proveedor/show-advance-filter-Estatus_de_Proveedor.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_ProveedorComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_ProveedorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_ProveedorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_ProveedorComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_ProveedorComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_ProveedorRoutingModule {
 }

