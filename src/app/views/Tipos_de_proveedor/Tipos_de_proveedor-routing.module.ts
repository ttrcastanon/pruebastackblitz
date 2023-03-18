import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipos_de_proveedorComponent } from './Tipos_de_proveedor-add-edit/Tipos_de_proveedor.component';
import { ListTipos_de_proveedorComponent } from './list-Tipos_de_proveedor/list-Tipos_de_proveedor.component';
import { ShowAdvanceFilterTipos_de_proveedorComponent } from './show-advance-filter-Tipos_de_proveedor/show-advance-filter-Tipos_de_proveedor.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipos_de_proveedorComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipos_de_proveedorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipos_de_proveedorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipos_de_proveedorComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipos_de_proveedorComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipos_de_proveedorRoutingModule {
 }

