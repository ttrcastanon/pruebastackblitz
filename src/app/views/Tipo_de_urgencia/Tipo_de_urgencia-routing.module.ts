import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_urgenciaComponent } from './Tipo_de_urgencia-add-edit/Tipo_de_urgencia.component';
import { ListTipo_de_urgenciaComponent } from './list-Tipo_de_urgencia/list-Tipo_de_urgencia.component';
import { ShowAdvanceFilterTipo_de_urgenciaComponent } from './show-advance-filter-Tipo_de_urgencia/show-advance-filter-Tipo_de_urgencia.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_urgenciaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_urgenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_urgenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_urgenciaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_urgenciaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_urgenciaRoutingModule {
 }

