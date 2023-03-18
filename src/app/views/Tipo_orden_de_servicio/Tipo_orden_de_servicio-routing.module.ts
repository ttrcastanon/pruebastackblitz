import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_orden_de_servicioComponent } from './Tipo_orden_de_servicio-add-edit/Tipo_orden_de_servicio.component';
import { ListTipo_orden_de_servicioComponent } from './list-Tipo_orden_de_servicio/list-Tipo_orden_de_servicio.component';
import { ShowAdvanceFilterTipo_orden_de_servicioComponent } from './show-advance-filter-Tipo_orden_de_servicio/show-advance-filter-Tipo_orden_de_servicio.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_orden_de_servicioComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_orden_de_servicioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_orden_de_servicioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_orden_de_servicioComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_orden_de_servicioComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_orden_de_servicioRoutingModule {
 }

