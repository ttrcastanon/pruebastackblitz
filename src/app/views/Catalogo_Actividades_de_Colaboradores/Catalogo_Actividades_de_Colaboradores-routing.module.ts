import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Catalogo_Actividades_de_ColaboradoresComponent } from './Catalogo_Actividades_de_Colaboradores-add-edit/Catalogo_Actividades_de_Colaboradores.component';
import { ListCatalogo_Actividades_de_ColaboradoresComponent } from './list-Catalogo_Actividades_de_Colaboradores/list-Catalogo_Actividades_de_Colaboradores.component';
import { ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent } from './show-advance-filter-Catalogo_Actividades_de_Colaboradores/show-advance-filter-Catalogo_Actividades_de_Colaboradores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCatalogo_Actividades_de_ColaboradoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Catalogo_Actividades_de_ColaboradoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Catalogo_Actividades_de_ColaboradoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Catalogo_Actividades_de_ColaboradoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Catalogo_Actividades_de_ColaboradoresRoutingModule {
 }

