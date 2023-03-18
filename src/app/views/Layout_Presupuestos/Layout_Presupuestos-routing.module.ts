import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_PresupuestosComponent } from './Layout_Presupuestos-add-edit/Layout_Presupuestos.component';
import { ListLayout_PresupuestosComponent } from './list-Layout_Presupuestos/list-Layout_Presupuestos.component';
import { ShowAdvanceFilterLayout_PresupuestosComponent } from './show-advance-filter-Layout_Presupuestos/show-advance-filter-Layout_Presupuestos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_PresupuestosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_PresupuestosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_PresupuestosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_PresupuestosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_PresupuestosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_PresupuestosRoutingModule {
 }

