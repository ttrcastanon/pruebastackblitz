import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Piezas_RequeridasComponent } from './Piezas_Requeridas-add-edit/Piezas_Requeridas.component';
import { ListPiezas_RequeridasComponent } from './list-Piezas_Requeridas/list-Piezas_Requeridas.component';
import { ShowAdvanceFilterPiezas_RequeridasComponent } from './show-advance-filter-Piezas_Requeridas/show-advance-filter-Piezas_Requeridas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPiezas_RequeridasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Piezas_RequeridasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Piezas_RequeridasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Piezas_RequeridasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPiezas_RequeridasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Piezas_RequeridasRoutingModule {
 }

