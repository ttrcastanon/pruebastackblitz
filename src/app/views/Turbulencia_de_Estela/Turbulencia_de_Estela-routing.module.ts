import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Turbulencia_de_EstelaComponent } from './Turbulencia_de_Estela-add-edit/Turbulencia_de_Estela.component';
import { ListTurbulencia_de_EstelaComponent } from './list-Turbulencia_de_Estela/list-Turbulencia_de_Estela.component';
import { ShowAdvanceFilterTurbulencia_de_EstelaComponent } from './show-advance-filter-Turbulencia_de_Estela/show-advance-filter-Turbulencia_de_Estela.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTurbulencia_de_EstelaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Turbulencia_de_EstelaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Turbulencia_de_EstelaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Turbulencia_de_EstelaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTurbulencia_de_EstelaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Turbulencia_de_EstelaRoutingModule {
 }

