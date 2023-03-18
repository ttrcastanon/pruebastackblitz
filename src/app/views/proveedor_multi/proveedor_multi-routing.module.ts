import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { proveedor_multiComponent } from './proveedor_multi-add-edit/proveedor_multi.component';
import { Listproveedor_multiComponent } from './list-proveedor_multi/list-proveedor_multi.component';
import { ShowAdvanceFilterproveedor_multiComponent } from './show-advance-filter-proveedor_multi/show-advance-filter-proveedor_multi.component';


const routes: Routes = [
  {
    path: 'list',
     component: Listproveedor_multiComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: proveedor_multiComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: proveedor_multiComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: proveedor_multiComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterproveedor_multiComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class proveedor_multiRoutingModule {
 }

