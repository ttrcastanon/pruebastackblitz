import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_TransporteComponent } from './Tipo_de_Transporte-add-edit/Tipo_de_Transporte.component';
import { ListTipo_de_TransporteComponent } from './list-Tipo_de_Transporte/list-Tipo_de_Transporte.component';
import { ShowAdvanceFilterTipo_de_TransporteComponent } from './show-advance-filter-Tipo_de_Transporte/show-advance-filter-Tipo_de_Transporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_TransporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_TransporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_TransporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_TransporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_TransporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_TransporteRoutingModule {
 }

