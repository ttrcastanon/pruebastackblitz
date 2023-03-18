import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_Cuentas_por_pagarComponent } from './Layout_Cuentas_por_pagar-add-edit/Layout_Cuentas_por_pagar.component';
import { ListLayout_Cuentas_por_pagarComponent } from './list-Layout_Cuentas_por_pagar/list-Layout_Cuentas_por_pagar.component';
import { ShowAdvanceFilterLayout_Cuentas_por_pagarComponent } from './show-advance-filter-Layout_Cuentas_por_pagar/show-advance-filter-Layout_Cuentas_por_pagar.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_Cuentas_por_pagarComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_Cuentas_por_pagarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_Cuentas_por_pagarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_Cuentas_por_pagarComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_Cuentas_por_pagarComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_Cuentas_por_pagarRoutingModule {
 }

