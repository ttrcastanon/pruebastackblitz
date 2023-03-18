import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Proveedores_de_SegurosComponent } from './Proveedores_de_Seguros-add-edit/Proveedores_de_Seguros.component';
import { ListProveedores_de_SegurosComponent } from './list-Proveedores_de_Seguros/list-Proveedores_de_Seguros.component';
import { ShowAdvanceFilterProveedores_de_SegurosComponent } from './show-advance-filter-Proveedores_de_Seguros/show-advance-filter-Proveedores_de_Seguros.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListProveedores_de_SegurosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Proveedores_de_SegurosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Proveedores_de_SegurosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Proveedores_de_SegurosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterProveedores_de_SegurosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Proveedores_de_SegurosRoutingModule {
 }

