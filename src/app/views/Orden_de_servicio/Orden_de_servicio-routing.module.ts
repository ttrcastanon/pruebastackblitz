import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Orden_de_servicioComponent } from './Orden_de_servicio-add-edit/Orden_de_servicio.component';
import { ListOrden_de_servicioComponent } from './list-Orden_de_servicio/list-Orden_de_servicio.component';
import { ShowAdvanceFilterOrden_de_servicioComponent } from './show-advance-filter-Orden_de_servicio/show-advance-filter-Orden_de_servicio.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListOrden_de_servicioComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
     component: ListOrden_de_servicioComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Orden_de_servicioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Orden_de_servicioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Orden_de_servicioComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterOrden_de_servicioComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Orden_de_servicioRoutingModule {
 }

