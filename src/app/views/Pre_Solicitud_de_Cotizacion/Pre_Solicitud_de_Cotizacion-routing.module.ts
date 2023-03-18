import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Pre_Solicitud_de_CotizacionComponent } from './Pre_Solicitud_de_Cotizacion-add-edit/Pre_Solicitud_de_Cotizacion.component';
import { ListPre_Solicitud_de_CotizacionComponent } from './list-Pre_Solicitud_de_Cotizacion/list-Pre_Solicitud_de_Cotizacion.component';
import { ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent } from './show-advance-filter-Pre_Solicitud_de_Cotizacion/show-advance-filter-Pre_Solicitud_de_Cotizacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPre_Solicitud_de_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Pre_Solicitud_de_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Pre_Solicitud_de_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Pre_Solicitud_de_CotizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Pre_Solicitud_de_CotizacionRoutingModule {
 }

