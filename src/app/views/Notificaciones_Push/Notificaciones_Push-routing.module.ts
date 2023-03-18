import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Notificaciones_PushComponent } from './Notificaciones_Push-add-edit/Notificaciones_Push.component';
import { ListNotificaciones_PushComponent } from './list-Notificaciones_Push/list-Notificaciones_Push.component';
import { ShowAdvanceFilterNotificaciones_PushComponent } from './show-advance-filter-Notificaciones_Push/show-advance-filter-Notificaciones_Push.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListNotificaciones_PushComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Notificaciones_PushComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Notificaciones_PushComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Notificaciones_PushComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterNotificaciones_PushComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Notificaciones_PushRoutingModule {
 }

