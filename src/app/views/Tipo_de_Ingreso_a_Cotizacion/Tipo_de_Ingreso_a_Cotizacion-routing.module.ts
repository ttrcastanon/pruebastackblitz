import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Ingreso_a_CotizacionComponent } from './Tipo_de_Ingreso_a_Cotizacion-add-edit/Tipo_de_Ingreso_a_Cotizacion.component';
import { ListTipo_de_Ingreso_a_CotizacionComponent } from './list-Tipo_de_Ingreso_a_Cotizacion/list-Tipo_de_Ingreso_a_Cotizacion.component';
import { ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent } from './show-advance-filter-Tipo_de_Ingreso_a_Cotizacion/show-advance-filter-Tipo_de_Ingreso_a_Cotizacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Ingreso_a_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Ingreso_a_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Ingreso_a_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Ingreso_a_CotizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Ingreso_a_CotizacionRoutingModule {
 }

