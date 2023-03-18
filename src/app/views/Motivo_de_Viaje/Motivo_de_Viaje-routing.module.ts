import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Motivo_de_ViajeComponent } from './Motivo_de_Viaje-add-edit/Motivo_de_Viaje.component';
import { ListMotivo_de_ViajeComponent } from './list-Motivo_de_Viaje/list-Motivo_de_Viaje.component';
import { ShowAdvanceFilterMotivo_de_ViajeComponent } from './show-advance-filter-Motivo_de_Viaje/show-advance-filter-Motivo_de_Viaje.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListMotivo_de_ViajeComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Motivo_de_ViajeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Motivo_de_ViajeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Motivo_de_ViajeComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterMotivo_de_ViajeComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Motivo_de_ViajeRoutingModule {
 }

