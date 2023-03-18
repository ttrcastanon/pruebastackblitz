import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_Ordenes_de_TrabajoComponent } from './Listado_de_Ordenes_de_Trabajo-add-edit/Listado_de_Ordenes_de_Trabajo.component';
import { ListListado_de_Ordenes_de_TrabajoComponent } from './list-Listado_de_Ordenes_de_Trabajo/list-Listado_de_Ordenes_de_Trabajo.component';
import { ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent } from './show-advance-filter-Listado_de_Ordenes_de_Trabajo/show-advance-filter-Listado_de_Ordenes_de_Trabajo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_Ordenes_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_Ordenes_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_Ordenes_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_Ordenes_de_TrabajoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_Ordenes_de_TrabajoRoutingModule {
 }

