import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Presupuesto_AnualComponent } from './Presupuesto_Anual-add-edit/Presupuesto_Anual.component';
import { ListPresupuesto_AnualComponent } from './list-Presupuesto_Anual/list-Presupuesto_Anual.component';
import { ShowAdvanceFilterPresupuesto_AnualComponent } from './show-advance-filter-Presupuesto_Anual/show-advance-filter-Presupuesto_Anual.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPresupuesto_AnualComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Presupuesto_AnualComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Presupuesto_AnualComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Presupuesto_AnualComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPresupuesto_AnualComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Presupuesto_AnualRoutingModule {
 }

