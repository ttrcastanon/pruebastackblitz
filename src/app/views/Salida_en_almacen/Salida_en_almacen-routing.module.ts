import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Salida_en_almacenComponent } from './Salida_en_almacen-add-edit/Salida_en_almacen.component';
import { ListSalida_en_almacenComponent } from './list-Salida_en_almacen/list-Salida_en_almacen.component';
import { ShowAdvanceFilterSalida_en_almacenComponent } from './show-advance-filter-Salida_en_almacen/show-advance-filter-Salida_en_almacen.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSalida_en_almacenComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Salida_en_almacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Salida_en_almacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Salida_en_almacenComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSalida_en_almacenComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Salida_en_almacenRoutingModule {
 }

