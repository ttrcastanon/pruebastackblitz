import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Clasificacion_de_proveedoresComponent } from './Clasificacion_de_proveedores-add-edit/Clasificacion_de_proveedores.component';
import { ListClasificacion_de_proveedoresComponent } from './list-Clasificacion_de_proveedores/list-Clasificacion_de_proveedores.component';
import { ShowAdvanceFilterClasificacion_de_proveedoresComponent } from './show-advance-filter-Clasificacion_de_proveedores/show-advance-filter-Clasificacion_de_proveedores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListClasificacion_de_proveedoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Clasificacion_de_proveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Clasificacion_de_proveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Clasificacion_de_proveedoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterClasificacion_de_proveedoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Clasificacion_de_proveedoresRoutingModule {
 }

