import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Motivo_de_Edicion_de_CotizacionComponent } from './Motivo_de_Edicion_de_Cotizacion-add-edit/Motivo_de_Edicion_de_Cotizacion.component';
import { ListMotivo_de_Edicion_de_CotizacionComponent } from './list-Motivo_de_Edicion_de_Cotizacion/list-Motivo_de_Edicion_de_Cotizacion.component';
import { ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent } from './show-advance-filter-Motivo_de_Edicion_de_Cotizacion/show-advance-filter-Motivo_de_Edicion_de_Cotizacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListMotivo_de_Edicion_de_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Motivo_de_Edicion_de_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Motivo_de_Edicion_de_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Motivo_de_Edicion_de_CotizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Motivo_de_Edicion_de_CotizacionRoutingModule {
 }

