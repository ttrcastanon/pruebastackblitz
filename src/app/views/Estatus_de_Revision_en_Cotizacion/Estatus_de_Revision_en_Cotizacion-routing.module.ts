import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_Revision_en_CotizacionComponent } from './Estatus_de_Revision_en_Cotizacion-add-edit/Estatus_de_Revision_en_Cotizacion.component';
import { ListEstatus_de_Revision_en_CotizacionComponent } from './list-Estatus_de_Revision_en_Cotizacion/list-Estatus_de_Revision_en_Cotizacion.component';
import { ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent } from './show-advance-filter-Estatus_de_Revision_en_Cotizacion/show-advance-filter-Estatus_de_Revision_en_Cotizacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_Revision_en_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_Revision_en_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_Revision_en_CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_Revision_en_CotizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_Revision_en_CotizacionRoutingModule {
 }

