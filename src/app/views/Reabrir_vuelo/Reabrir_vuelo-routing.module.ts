import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Reabrir_vueloComponent } from './Reabrir_vuelo-add-edit/Reabrir_vuelo.component';
import { ListReabrir_vueloComponent } from './list-Reabrir_vuelo/list-Reabrir_vuelo.component';
import { ShowAdvanceFilterReabrir_vueloComponent } from './show-advance-filter-Reabrir_vuelo/show-advance-filter-Reabrir_vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListReabrir_vueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Reabrir_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Reabrir_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Reabrir_vueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterReabrir_vueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Reabrir_vueloRoutingModule {
 }

