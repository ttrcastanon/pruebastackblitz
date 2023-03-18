import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Solicitudes_de_mantenimientos_externosComponent } from './Solicitudes_de_mantenimientos_externos-add-edit/Solicitudes_de_mantenimientos_externos.component';
import { ListSolicitudes_de_mantenimientos_externosComponent } from './list-Solicitudes_de_mantenimientos_externos/list-Solicitudes_de_mantenimientos_externos.component';
import { ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent } from './show-advance-filter-Solicitudes_de_mantenimientos_externos/show-advance-filter-Solicitudes_de_mantenimientos_externos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSolicitudes_de_mantenimientos_externosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Solicitudes_de_mantenimientos_externosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Solicitudes_de_mantenimientos_externosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Solicitudes_de_mantenimientos_externosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Solicitudes_de_mantenimientos_externosRoutingModule {
 }

