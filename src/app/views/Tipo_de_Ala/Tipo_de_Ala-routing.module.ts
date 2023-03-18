import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_AlaComponent } from './Tipo_de_Ala-add-edit/Tipo_de_Ala.component';
import { ListTipo_de_AlaComponent } from './list-Tipo_de_Ala/list-Tipo_de_Ala.component';
import { ShowAdvanceFilterTipo_de_AlaComponent } from './show-advance-filter-Tipo_de_Ala/show-advance-filter-Tipo_de_Ala.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_AlaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_AlaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_AlaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_AlaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_AlaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_AlaRoutingModule {
 }

