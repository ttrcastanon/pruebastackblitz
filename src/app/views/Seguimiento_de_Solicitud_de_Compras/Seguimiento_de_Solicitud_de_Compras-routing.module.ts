import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Seguimiento_de_Solicitud_de_ComprasComponent } from './Seguimiento_de_Solicitud_de_Compras-add-edit/Seguimiento_de_Solicitud_de_Compras.component';
import { ListSeguimiento_de_Solicitud_de_ComprasComponent } from './list-Seguimiento_de_Solicitud_de_Compras/list-Seguimiento_de_Solicitud_de_Compras.component';
import { ShowAdvanceFilterSeguimiento_de_Solicitud_de_ComprasComponent } from './show-advance-filter-Seguimiento_de_Solicitud_de_Compras/show-advance-filter-Seguimiento_de_Solicitud_de_Compras.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListSeguimiento_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Seguimiento_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'cancel',
    component: Seguimiento_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Seguimiento_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Seguimiento_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterSeguimiento_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Seguimiento_de_Solicitud_de_ComprasRoutingModule {
}

