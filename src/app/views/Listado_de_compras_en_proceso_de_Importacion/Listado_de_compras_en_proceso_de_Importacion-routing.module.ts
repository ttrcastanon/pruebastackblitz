import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_compras_en_proceso_de_ImportacionComponent } from './Listado_de_compras_en_proceso_de_Importacion-add-edit/Listado_de_compras_en_proceso_de_Importacion.component';
import { ListListado_de_compras_en_proceso_de_ImportacionComponent } from './list-Listado_de_compras_en_proceso_de_Importacion/list-Listado_de_compras_en_proceso_de_Importacion.component';
import { ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent } from './show-advance-filter-Listado_de_compras_en_proceso_de_Importacion/show-advance-filter-Listado_de_compras_en_proceso_de_Importacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_compras_en_proceso_de_ImportacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_compras_en_proceso_de_ImportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_compras_en_proceso_de_ImportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_compras_en_proceso_de_ImportacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_compras_en_proceso_de_ImportacionRoutingModule {
 }

