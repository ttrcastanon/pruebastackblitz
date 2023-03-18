import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Productividad_del_area_de_mantenimientoComponent } from './Productividad_del_area_de_mantenimiento-add-edit/Productividad_del_area_de_mantenimiento.component';
import { ListProductividad_del_area_de_mantenimientoComponent } from './list-Productividad_del_area_de_mantenimiento/list-Productividad_del_area_de_mantenimiento.component';
import { ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent } from './show-advance-filter-Productividad_del_area_de_mantenimiento/show-advance-filter-Productividad_del_area_de_mantenimiento.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListProductividad_del_area_de_mantenimientoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Productividad_del_area_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Productividad_del_area_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Productividad_del_area_de_mantenimientoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Productividad_del_area_de_mantenimientoRoutingModule {
 }

