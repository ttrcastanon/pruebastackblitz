import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Gestion_de_aprobacionComponent } from './Gestion_de_aprobacion-add-edit/Gestion_de_aprobacion.component';
import { ListGestion_de_aprobacionComponent } from './list-Gestion_de_aprobacion/list-Gestion_de_aprobacion.component';
import { ShowAdvanceFilterGestion_de_aprobacionComponent } from './show-advance-filter-Gestion_de_aprobacion/show-advance-filter-Gestion_de_aprobacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListGestion_de_aprobacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Gestion_de_aprobacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Gestion_de_aprobacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Gestion_de_aprobacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterGestion_de_aprobacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Gestion_de_aprobacionRoutingModule {
 }

