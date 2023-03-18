import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_BoletinComponent } from './Tipo_de_Boletin-add-edit/Tipo_de_Boletin.component';
import { ListTipo_de_BoletinComponent } from './list-Tipo_de_Boletin/list-Tipo_de_Boletin.component';
import { ShowAdvanceFilterTipo_de_BoletinComponent } from './show-advance-filter-Tipo_de_Boletin/show-advance-filter-Tipo_de_Boletin.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_BoletinComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_BoletinComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_BoletinComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_BoletinComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_BoletinComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_BoletinRoutingModule {
 }

