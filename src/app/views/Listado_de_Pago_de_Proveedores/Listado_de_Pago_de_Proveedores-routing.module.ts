import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_Pago_de_ProveedoresComponent } from './Listado_de_Pago_de_Proveedores-add-edit/Listado_de_Pago_de_Proveedores.component';
import { ListListado_de_Pago_de_ProveedoresComponent } from './list-Listado_de_Pago_de_Proveedores/list-Listado_de_Pago_de_Proveedores.component';
import { ShowAdvanceFilterListado_de_Pago_de_ProveedoresComponent } from './show-advance-filter-Listado_de_Pago_de_Proveedores/show-advance-filter-Listado_de_Pago_de_Proveedores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_Pago_de_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_Pago_de_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_Pago_de_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_Pago_de_ProveedoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_Pago_de_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_Pago_de_ProveedoresRoutingModule {
 }

