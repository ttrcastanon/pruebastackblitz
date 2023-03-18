import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { ServiciosComponent } from './Servicios-add-edit/Servicios.component';
import { ListServiciosComponent } from './list-Servicios/list-Servicios.component';
import { ShowAdvanceFilterServiciosComponent } from './show-advance-filter-Servicios/show-advance-filter-Servicios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListServiciosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ServiciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ServiciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ServiciosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterServiciosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ServiciosRoutingModule {
 }

