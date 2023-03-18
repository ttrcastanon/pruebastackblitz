import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Orden_de_TrabajoComponent } from './Tipo_de_Orden_de_Trabajo-add-edit/Tipo_de_Orden_de_Trabajo.component';
import { ListTipo_de_Orden_de_TrabajoComponent } from './list-Tipo_de_Orden_de_Trabajo/list-Tipo_de_Orden_de_Trabajo.component';
import { ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent } from './show-advance-filter-Tipo_de_Orden_de_Trabajo/show-advance-filter-Tipo_de_Orden_de_Trabajo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Orden_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Orden_de_TrabajoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Orden_de_TrabajoRoutingModule {
 }

