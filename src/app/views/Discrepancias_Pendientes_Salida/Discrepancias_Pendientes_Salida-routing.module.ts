import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Discrepancias_Pendientes_SalidaComponent } from './Discrepancias_Pendientes_Salida-add-edit/Discrepancias_Pendientes_Salida.component';
import { ListDiscrepancias_Pendientes_SalidaComponent } from './list-Discrepancias_Pendientes_Salida/list-Discrepancias_Pendientes_Salida.component';
import { ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent } from './show-advance-filter-Discrepancias_Pendientes_Salida/show-advance-filter-Discrepancias_Pendientes_Salida.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDiscrepancias_Pendientes_SalidaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Discrepancias_Pendientes_SalidaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Discrepancias_Pendientes_SalidaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Discrepancias_Pendientes_SalidaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Discrepancias_Pendientes_SalidaRoutingModule {
 }

