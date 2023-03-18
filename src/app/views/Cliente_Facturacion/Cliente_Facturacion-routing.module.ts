import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Cliente_FacturacionComponent } from './Cliente_Facturacion-add-edit/Cliente_Facturacion.component';
import { ListCliente_FacturacionComponent } from './list-Cliente_Facturacion/list-Cliente_Facturacion.component';
import { ShowAdvanceFilterCliente_FacturacionComponent } from './show-advance-filter-Cliente_Facturacion/show-advance-filter-Cliente_Facturacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCliente_FacturacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Cliente_FacturacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Cliente_FacturacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Cliente_FacturacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCliente_FacturacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Cliente_FacturacionRoutingModule {
 }

