import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_Orden_de_TrabajoComponent } from './Estatus_de_Orden_de_Trabajo-add-edit/Estatus_de_Orden_de_Trabajo.component';
import { ListEstatus_de_Orden_de_TrabajoComponent } from './list-Estatus_de_Orden_de_Trabajo/list-Estatus_de_Orden_de_Trabajo.component';
import { ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent } from './show-advance-filter-Estatus_de_Orden_de_Trabajo/show-advance-filter-Estatus_de_Orden_de_Trabajo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_Orden_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_Orden_de_TrabajoRoutingModule {
 }

