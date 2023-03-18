import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Categorias_y_Documentos_RequeridosComponent } from './Categorias_y_Documentos_Requeridos-add-edit/Categorias_y_Documentos_Requeridos.component';
import { ListCategorias_y_Documentos_RequeridosComponent } from './list-Categorias_y_Documentos_Requeridos/list-Categorias_y_Documentos_Requeridos.component';
import { ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent } from './show-advance-filter-Categorias_y_Documentos_Requeridos/show-advance-filter-Categorias_y_Documentos_Requeridos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCategorias_y_Documentos_RequeridosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Categorias_y_Documentos_RequeridosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Categorias_y_Documentos_RequeridosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Categorias_y_Documentos_RequeridosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Categorias_y_Documentos_RequeridosRoutingModule {
 }

