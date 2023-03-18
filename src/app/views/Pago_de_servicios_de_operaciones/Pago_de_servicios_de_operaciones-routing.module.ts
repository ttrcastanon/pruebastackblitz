import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Pago_de_servicios_de_operacionesComponent } from './Pago_de_servicios_de_operaciones-add-edit/Pago_de_servicios_de_operaciones.component';
import { ListPago_de_servicios_de_operacionesComponent } from './list-Pago_de_servicios_de_operaciones/list-Pago_de_servicios_de_operaciones.component';
import { ShowAdvanceFilterPago_de_servicios_de_operacionesComponent } from './show-advance-filter-Pago_de_servicios_de_operaciones/show-advance-filter-Pago_de_servicios_de_operaciones.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPago_de_servicios_de_operacionesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Pago_de_servicios_de_operacionesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Pago_de_servicios_de_operacionesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Pago_de_servicios_de_operacionesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPago_de_servicios_de_operacionesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Pago_de_servicios_de_operacionesRoutingModule {
 }

