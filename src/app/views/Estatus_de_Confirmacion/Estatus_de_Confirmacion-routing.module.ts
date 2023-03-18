import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_ConfirmacionComponent } from './Estatus_de_Confirmacion-add-edit/Estatus_de_Confirmacion.component';
import { ListEstatus_de_ConfirmacionComponent } from './list-Estatus_de_Confirmacion/list-Estatus_de_Confirmacion.component';
import { ShowAdvanceFilterEstatus_de_ConfirmacionComponent } from './show-advance-filter-Estatus_de_Confirmacion/show-advance-filter-Estatus_de_Confirmacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_ConfirmacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_ConfirmacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_ConfirmacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_ConfirmacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_ConfirmacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_ConfirmacionRoutingModule {
 }

