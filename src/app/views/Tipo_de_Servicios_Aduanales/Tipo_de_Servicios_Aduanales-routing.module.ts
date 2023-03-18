import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Servicios_AduanalesComponent } from './Tipo_de_Servicios_Aduanales-add-edit/Tipo_de_Servicios_Aduanales.component';
import { ListTipo_de_Servicios_AduanalesComponent } from './list-Tipo_de_Servicios_Aduanales/list-Tipo_de_Servicios_Aduanales.component';
import { ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent } from './show-advance-filter-Tipo_de_Servicios_Aduanales/show-advance-filter-Tipo_de_Servicios_Aduanales.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Servicios_AduanalesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Servicios_AduanalesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Servicios_AduanalesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Servicios_AduanalesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Servicios_AduanalesRoutingModule {
 }

