import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_PilotoComponent } from './Tipo_de_Piloto-add-edit/Tipo_de_Piloto.component';
import { ListTipo_de_PilotoComponent } from './list-Tipo_de_Piloto/list-Tipo_de_Piloto.component';
import { ShowAdvanceFilterTipo_de_PilotoComponent } from './show-advance-filter-Tipo_de_Piloto/show-advance-filter-Tipo_de_Piloto.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_PilotoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_PilotoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_PilotoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_PilotoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_PilotoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_PilotoRoutingModule {
 }

