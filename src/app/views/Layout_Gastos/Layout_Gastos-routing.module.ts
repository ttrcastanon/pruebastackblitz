import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_GastosComponent } from './Layout_Gastos-add-edit/Layout_Gastos.component';
import { ListLayout_GastosComponent } from './list-Layout_Gastos/list-Layout_Gastos.component';
import { ShowAdvanceFilterLayout_GastosComponent } from './show-advance-filter-Layout_Gastos/show-advance-filter-Layout_Gastos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_GastosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_GastosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_GastosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_GastosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_GastosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_GastosRoutingModule {
 }

