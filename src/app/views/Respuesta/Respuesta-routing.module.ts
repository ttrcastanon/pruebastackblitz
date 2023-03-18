import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { RespuestaComponent } from './Respuesta-add-edit/Respuesta.component';
import { ListRespuestaComponent } from './list-Respuesta/list-Respuesta.component';
import { ShowAdvanceFilterRespuestaComponent } from './show-advance-filter-Respuesta/show-advance-filter-Respuesta.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListRespuestaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: RespuestaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: RespuestaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: RespuestaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterRespuestaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class RespuestaRoutingModule {
 }

