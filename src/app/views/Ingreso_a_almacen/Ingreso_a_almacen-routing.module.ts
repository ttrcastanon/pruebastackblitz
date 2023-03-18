import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Ingreso_a_almacenComponent } from './Ingreso_a_almacen-add-edit/Ingreso_a_almacen.component';
import { ListIngreso_a_almacenComponent } from './list-Ingreso_a_almacen/list-Ingreso_a_almacen.component';
import { ShowAdvanceFilterIngreso_a_almacenComponent } from './show-advance-filter-Ingreso_a_almacen/show-advance-filter-Ingreso_a_almacen.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListIngreso_a_almacenComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Ingreso_a_almacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Ingreso_a_almacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Ingreso_a_almacenComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterIngreso_a_almacenComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Ingreso_a_almacenRoutingModule {
 }

