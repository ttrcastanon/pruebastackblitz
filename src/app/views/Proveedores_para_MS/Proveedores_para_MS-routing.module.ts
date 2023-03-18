import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Proveedores_para_MSComponent } from './Proveedores_para_MS-add-edit/Proveedores_para_MS.component';
import { ListProveedores_para_MSComponent } from './list-Proveedores_para_MS/list-Proveedores_para_MS.component';
import { ShowAdvanceFilterProveedores_para_MSComponent } from './show-advance-filter-Proveedores_para_MS/show-advance-filter-Proveedores_para_MS.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListProveedores_para_MSComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Proveedores_para_MSComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Proveedores_para_MSComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Proveedores_para_MSComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterProveedores_para_MSComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Proveedores_para_MSRoutingModule {
 }

