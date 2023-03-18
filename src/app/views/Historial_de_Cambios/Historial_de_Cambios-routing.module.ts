import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Historial_de_CambiosComponent } from './Historial_de_Cambios-add-edit/Historial_de_Cambios.component';
import { ListHistorial_de_CambiosComponent } from './list-Historial_de_Cambios/list-Historial_de_Cambios.component';
import { ShowAdvanceFilterHistorial_de_CambiosComponent } from './show-advance-filter-Historial_de_Cambios/show-advance-filter-Historial_de_Cambios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListHistorial_de_CambiosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Historial_de_CambiosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Historial_de_CambiosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Historial_de_CambiosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterHistorial_de_CambiosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Historial_de_CambiosRoutingModule {
 }

