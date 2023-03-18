import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Pago_a_proveedoresComponent } from './Pago_a_proveedores-add-edit/Pago_a_proveedores.component';
import { ListPago_a_proveedoresComponent } from './list-Pago_a_proveedores/list-Pago_a_proveedores.component';
import { ShowAdvanceFilterPago_a_proveedoresComponent } from './show-advance-filter-Pago_a_proveedores/show-advance-filter-Pago_a_proveedores.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListPago_a_proveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Pago_a_proveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Pago_a_proveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Pago_a_proveedoresComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterPago_a_proveedoresComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Pago_a_proveedoresRoutingModule {
}

