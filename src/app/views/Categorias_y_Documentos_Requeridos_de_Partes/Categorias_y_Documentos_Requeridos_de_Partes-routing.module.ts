import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Categorias_y_Documentos_Requeridos_de_PartesComponent } from './Categorias_y_Documentos_Requeridos_de_Partes-add-edit/Categorias_y_Documentos_Requeridos_de_Partes.component';
import { ListCategorias_y_Documentos_Requeridos_de_PartesComponent } from './list-Categorias_y_Documentos_Requeridos_de_Partes/list-Categorias_y_Documentos_Requeridos_de_Partes.component';
import { ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent } from './show-advance-filter-Categorias_y_Documentos_Requeridos_de_Partes/show-advance-filter-Categorias_y_Documentos_Requeridos_de_Partes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCategorias_y_Documentos_Requeridos_de_PartesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Categorias_y_Documentos_Requeridos_de_PartesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Categorias_y_Documentos_Requeridos_de_PartesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Categorias_y_Documentos_Requeridos_de_PartesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Categorias_y_Documentos_Requeridos_de_PartesRoutingModule {
 }

