import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_compras_en_proceso_de_ExportacionComponent } from './Listado_de_compras_en_proceso_de_Exportacion-add-edit/Listado_de_compras_en_proceso_de_Exportacion.component';
import { ListListado_de_compras_en_proceso_de_ExportacionComponent } from './list-Listado_de_compras_en_proceso_de_Exportacion/list-Listado_de_compras_en_proceso_de_Exportacion.component';
import { ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent } from './show-advance-filter-Listado_de_compras_en_proceso_de_Exportacion/show-advance-filter-Listado_de_compras_en_proceso_de_Exportacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_compras_en_proceso_de_ExportacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_compras_en_proceso_de_ExportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_compras_en_proceso_de_ExportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_compras_en_proceso_de_ExportacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_compras_en_proceso_de_ExportacionRoutingModule {
 }

