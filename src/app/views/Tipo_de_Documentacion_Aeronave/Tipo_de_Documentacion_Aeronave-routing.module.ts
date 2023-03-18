import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Documentacion_AeronaveComponent } from './Tipo_de_Documentacion_Aeronave-add-edit/Tipo_de_Documentacion_Aeronave.component';
import { ListTipo_de_Documentacion_AeronaveComponent } from './list-Tipo_de_Documentacion_Aeronave/list-Tipo_de_Documentacion_Aeronave.component';
import { ShowAdvanceFilterTipo_de_Documentacion_AeronaveComponent } from './show-advance-filter-Tipo_de_Documentacion_Aeronave/show-advance-filter-Tipo_de_Documentacion_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Documentacion_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Documentacion_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Documentacion_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Documentacion_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Documentacion_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Documentacion_AeronaveRoutingModule {
 }

