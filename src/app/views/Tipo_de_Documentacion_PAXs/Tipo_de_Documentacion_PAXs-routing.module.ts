import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Documentacion_PAXsComponent } from './Tipo_de_Documentacion_PAXs-add-edit/Tipo_de_Documentacion_PAXs.component';
import { ListTipo_de_Documentacion_PAXsComponent } from './list-Tipo_de_Documentacion_PAXs/list-Tipo_de_Documentacion_PAXs.component';
import { ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent } from './show-advance-filter-Tipo_de_Documentacion_PAXs/show-advance-filter-Tipo_de_Documentacion_PAXs.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Documentacion_PAXsComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Documentacion_PAXsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Documentacion_PAXsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Documentacion_PAXsComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Documentacion_PAXsRoutingModule {
 }

