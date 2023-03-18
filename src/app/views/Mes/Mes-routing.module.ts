import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { MesComponent } from './Mes-add-edit/Mes.component';
import { ListMesComponent } from './list-Mes/list-Mes.component';
import { ShowAdvanceFilterMesComponent } from './show-advance-filter-Mes/show-advance-filter-Mes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListMesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: MesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: MesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: MesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterMesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class MesRoutingModule {
 }

