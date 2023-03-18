import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Generacion_de_Orden_de_ComprasComponent } from './Generacion_de_Orden_de_Compras-add-edit/Generacion_de_Orden_de_Compras.component';
import { ListGeneracion_de_Orden_de_ComprasComponent } from './list-Generacion_de_Orden_de_Compras/list-Generacion_de_Orden_de_Compras.component';
import { ShowAdvanceFilterGeneracion_de_Orden_de_ComprasComponent } from './show-advance-filter-Generacion_de_Orden_de_Compras/show-advance-filter-Generacion_de_Orden_de_Compras.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListGeneracion_de_Orden_de_ComprasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Generacion_de_Orden_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Generacion_de_Orden_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Generacion_de_Orden_de_ComprasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterGeneracion_de_Orden_de_ComprasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Generacion_de_Orden_de_ComprasRoutingModule {
 }

