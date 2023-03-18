import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Ingreso_de_GastoComponent } from './Tipo_de_Ingreso_de_Gasto-add-edit/Tipo_de_Ingreso_de_Gasto.component';
import { ListTipo_de_Ingreso_de_GastoComponent } from './list-Tipo_de_Ingreso_de_Gasto/list-Tipo_de_Ingreso_de_Gasto.component';
import { ShowAdvanceFilterTipo_de_Ingreso_de_GastoComponent } from './show-advance-filter-Tipo_de_Ingreso_de_Gasto/show-advance-filter-Tipo_de_Ingreso_de_Gasto.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Ingreso_de_GastoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Ingreso_de_GastoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Ingreso_de_GastoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Ingreso_de_GastoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Ingreso_de_GastoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Ingreso_de_GastoRoutingModule {
 }

