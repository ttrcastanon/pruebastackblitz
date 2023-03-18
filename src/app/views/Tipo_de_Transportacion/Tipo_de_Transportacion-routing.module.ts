import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_TransportacionComponent } from './Tipo_de_Transportacion-add-edit/Tipo_de_Transportacion.component';
import { ListTipo_de_TransportacionComponent } from './list-Tipo_de_Transportacion/list-Tipo_de_Transportacion.component';
import { ShowAdvanceFilterTipo_de_TransportacionComponent } from './show-advance-filter-Tipo_de_Transportacion/show-advance-filter-Tipo_de_Transportacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_TransportacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_TransportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_TransportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_TransportacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_TransportacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_TransportacionRoutingModule {
 }

