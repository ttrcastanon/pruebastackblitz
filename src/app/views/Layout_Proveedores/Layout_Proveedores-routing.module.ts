import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_ProveedoresComponent } from './Layout_Proveedores-add-edit/Layout_Proveedores.component';
import { ListLayout_ProveedoresComponent } from './list-Layout_Proveedores/list-Layout_Proveedores.component';
import { ShowAdvanceFilterLayout_ProveedoresComponent } from './show-advance-filter-Layout_Proveedores/show-advance-filter-Layout_Proveedores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_ProveedoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_ProveedoresRoutingModule {
 }

