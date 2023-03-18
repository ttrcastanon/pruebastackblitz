import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_DestinoComponent } from './Tipo_de_Destino-add-edit/Tipo_de_Destino.component';
import { ListTipo_de_DestinoComponent } from './list-Tipo_de_Destino/list-Tipo_de_Destino.component';
import { ShowAdvanceFilterTipo_de_DestinoComponent } from './show-advance-filter-Tipo_de_Destino/show-advance-filter-Tipo_de_Destino.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_DestinoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_DestinoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_DestinoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_DestinoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_DestinoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_DestinoRoutingModule {
 }

