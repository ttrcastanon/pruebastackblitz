import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Solicitud_de_cotizacionComponent } from './Solicitud_de_cotizacion-add-edit/Solicitud_de_cotizacion.component';
import { ListSolicitud_de_cotizacionComponent } from './list-Solicitud_de_cotizacion/list-Solicitud_de_cotizacion.component';
import { ShowAdvanceFilterSolicitud_de_cotizacionComponent } from './show-advance-filter-Solicitud_de_cotizacion/show-advance-filter-Solicitud_de_cotizacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSolicitud_de_cotizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Solicitud_de_cotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Solicitud_de_cotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Solicitud_de_cotizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSolicitud_de_cotizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Solicitud_de_cotizacionRoutingModule {
 }

