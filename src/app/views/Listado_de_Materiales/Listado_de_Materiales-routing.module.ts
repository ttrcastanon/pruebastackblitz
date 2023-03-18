import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_MaterialesComponent } from './Listado_de_Materiales-add-edit/Listado_de_Materiales.component';
import { ListListado_de_MaterialesComponent } from './list-Listado_de_Materiales/list-Listado_de_Materiales.component';
import { ShowAdvanceFilterListado_de_MaterialesComponent } from './show-advance-filter-Listado_de_Materiales/show-advance-filter-Listado_de_Materiales.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_MaterialesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_MaterialesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_MaterialesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_MaterialesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_MaterialesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_MaterialesRoutingModule {
 }

