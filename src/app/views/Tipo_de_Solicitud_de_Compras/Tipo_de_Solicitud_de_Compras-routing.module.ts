import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Solicitud_de_ComprasComponent } from './Tipo_de_Solicitud_de_Compras-add-edit/Tipo_de_Solicitud_de_Compras.component';
import { ListTipo_de_Solicitud_de_ComprasComponent } from './list-Tipo_de_Solicitud_de_Compras/list-Tipo_de_Solicitud_de_Compras.component';
import { ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent } from './show-advance-filter-Tipo_de_Solicitud_de_Compras/show-advance-filter-Tipo_de_Solicitud_de_Compras.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Solicitud_de_ComprasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Solicitud_de_ComprasRoutingModule {
 }

