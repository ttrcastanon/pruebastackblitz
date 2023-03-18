import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Respuesta_del_Cliente_a_CotizacionComponent } from './Respuesta_del_Cliente_a_Cotizacion-add-edit/Respuesta_del_Cliente_a_Cotizacion.component';
import { ListRespuesta_del_Cliente_a_CotizacionComponent } from './list-Respuesta_del_Cliente_a_Cotizacion/list-Respuesta_del_Cliente_a_Cotizacion.component';
import { ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent } from './show-advance-filter-Respuesta_del_Cliente_a_Cotizacion/show-advance-filter-Respuesta_del_Cliente_a_Cotizacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListRespuesta_del_Cliente_a_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Respuesta_del_Cliente_a_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Respuesta_del_Cliente_a_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Respuesta_del_Cliente_a_CotizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Respuesta_del_Cliente_a_CotizacionRoutingModule {
 }

