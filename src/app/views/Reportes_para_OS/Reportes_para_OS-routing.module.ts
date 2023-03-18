import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Reportes_para_OSComponent } from './Reportes_para_OS-add-edit/Reportes_para_OS.component';
import { ListReportes_para_OSComponent } from './list-Reportes_para_OS/list-Reportes_para_OS.component';
import { ShowAdvanceFilterReportes_para_OSComponent } from './show-advance-filter-Reportes_para_OS/show-advance-filter-Reportes_para_OS.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListReportes_para_OSComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Reportes_para_OSComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Reportes_para_OSComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Reportes_para_OSComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterReportes_para_OSComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Reportes_para_OSRoutingModule {
 }

