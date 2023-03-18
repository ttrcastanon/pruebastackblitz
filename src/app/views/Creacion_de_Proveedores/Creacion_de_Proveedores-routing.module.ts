import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Creacion_de_ProveedoresComponent } from './Creacion_de_Proveedores-add-edit/Creacion_de_Proveedores.component';
import { ListCreacion_de_ProveedoresComponent } from './list-Creacion_de_Proveedores/list-Creacion_de_Proveedores.component';
import { ShowAdvanceFilterCreacion_de_ProveedoresComponent } from './show-advance-filter-Creacion_de_Proveedores/show-advance-filter-Creacion_de_Proveedores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCreacion_de_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Creacion_de_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Creacion_de_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Creacion_de_ProveedoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCreacion_de_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Creacion_de_ProveedoresRoutingModule {
 }

