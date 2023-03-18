import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Carga_ManualComponent } from './Carga_Manual-add-edit/Carga_Manual.component';
import { ListCarga_ManualComponent } from './list-Carga_Manual/list-Carga_Manual.component';
import { ShowAdvanceFilterCarga_ManualComponent } from './show-advance-filter-Carga_Manual/show-advance-filter-Carga_Manual.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCarga_ManualComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Carga_ManualComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Carga_ManualComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Carga_ManualComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCarga_ManualComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Carga_ManualRoutingModule {
 }

