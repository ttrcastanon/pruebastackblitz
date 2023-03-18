import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_MiscelaneasComponent } from './Tipo_de_Miscelaneas-add-edit/Tipo_de_Miscelaneas.component';
import { ListTipo_de_MiscelaneasComponent } from './list-Tipo_de_Miscelaneas/list-Tipo_de_Miscelaneas.component';
import { ShowAdvanceFilterTipo_de_MiscelaneasComponent } from './show-advance-filter-Tipo_de_Miscelaneas/show-advance-filter-Tipo_de_Miscelaneas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_MiscelaneasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_MiscelaneasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_MiscelaneasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_MiscelaneasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_MiscelaneasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_MiscelaneasRoutingModule {
 }

