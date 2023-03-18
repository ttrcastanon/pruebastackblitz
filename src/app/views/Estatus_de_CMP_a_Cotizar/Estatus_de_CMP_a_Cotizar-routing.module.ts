import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_CMP_a_CotizarComponent } from './Estatus_de_CMP_a_Cotizar-add-edit/Estatus_de_CMP_a_Cotizar.component';
import { ListEstatus_de_CMP_a_CotizarComponent } from './list-Estatus_de_CMP_a_Cotizar/list-Estatus_de_CMP_a_Cotizar.component';
import { ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent } from './show-advance-filter-Estatus_de_CMP_a_Cotizar/show-advance-filter-Estatus_de_CMP_a_Cotizar.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_CMP_a_CotizarComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_CMP_a_CotizarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_CMP_a_CotizarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_CMP_a_CotizarComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_CMP_a_CotizarRoutingModule {
 }

