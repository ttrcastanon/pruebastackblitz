import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Notificaciones_de_mantenimientoComponent } from './Notificaciones_de_mantenimiento-add-edit/Notificaciones_de_mantenimiento.component';
import { ListNotificaciones_de_mantenimientoComponent } from './list-Notificaciones_de_mantenimiento/list-Notificaciones_de_mantenimiento.component';
import { ShowAdvanceFilterNotificaciones_de_mantenimientoComponent } from './show-advance-filter-Notificaciones_de_mantenimiento/show-advance-filter-Notificaciones_de_mantenimiento.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListNotificaciones_de_mantenimientoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Notificaciones_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Notificaciones_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Notificaciones_de_mantenimientoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterNotificaciones_de_mantenimientoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Notificaciones_de_mantenimientoRoutingModule {
 }

