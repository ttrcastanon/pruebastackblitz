import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_AeropuertoComponent } from './Tipo_de_Aeropuerto-add-edit/Tipo_de_Aeropuerto.component';
import { ListTipo_de_AeropuertoComponent } from './list-Tipo_de_Aeropuerto/list-Tipo_de_Aeropuerto.component';
import { ShowAdvanceFilterTipo_de_AeropuertoComponent } from './show-advance-filter-Tipo_de_Aeropuerto/show-advance-filter-Tipo_de_Aeropuerto.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_AeropuertoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_AeropuertoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_AeropuertoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_AeropuertoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_AeropuertoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_AeropuertoRoutingModule {
 }

