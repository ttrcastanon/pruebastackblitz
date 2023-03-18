import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Orden_de_TrabajoComponent } from './Orden_de_Trabajo-add-edit/Orden_de_Trabajo.component';
import { ListOrden_de_TrabajoComponent } from './list-Orden_de_Trabajo/list-Orden_de_Trabajo.component';
import { ShowAdvanceFilterOrden_de_TrabajoComponent } from './show-advance-filter-Orden_de_Trabajo/show-advance-filter-Orden_de_Trabajo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListOrden_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
     component: ListOrden_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterOrden_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Orden_de_TrabajoRoutingModule {
 }

