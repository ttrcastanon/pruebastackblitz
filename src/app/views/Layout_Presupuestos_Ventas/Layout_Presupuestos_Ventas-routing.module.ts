import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_Presupuestos_VentasComponent } from './Layout_Presupuestos_Ventas-add-edit/Layout_Presupuestos_Ventas.component';
import { ListLayout_Presupuestos_VentasComponent } from './list-Layout_Presupuestos_Ventas/list-Layout_Presupuestos_Ventas.component';
import { ShowAdvanceFilterLayout_Presupuestos_VentasComponent } from './show-advance-filter-Layout_Presupuestos_Ventas/show-advance-filter-Layout_Presupuestos_Ventas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_Presupuestos_VentasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_Presupuestos_VentasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_Presupuestos_VentasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_Presupuestos_VentasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_Presupuestos_VentasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_Presupuestos_VentasRoutingModule {
 }

