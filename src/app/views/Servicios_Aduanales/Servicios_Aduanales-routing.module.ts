import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Servicios_AduanalesComponent } from './Servicios_Aduanales-add-edit/Servicios_Aduanales.component';
import { ListServicios_AduanalesComponent } from './list-Servicios_Aduanales/list-Servicios_Aduanales.component';
import { ShowAdvanceFilterServicios_AduanalesComponent } from './show-advance-filter-Servicios_Aduanales/show-advance-filter-Servicios_Aduanales.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListServicios_AduanalesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Servicios_AduanalesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Servicios_AduanalesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Servicios_AduanalesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterServicios_AduanalesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Servicios_AduanalesRoutingModule {
 }

