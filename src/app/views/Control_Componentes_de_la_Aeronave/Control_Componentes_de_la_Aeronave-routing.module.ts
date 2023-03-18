import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Control_Componentes_de_la_AeronaveComponent } from './Control_Componentes_de_la_Aeronave-add-edit/Control_Componentes_de_la_Aeronave.component';
import { ListControl_Componentes_de_la_AeronaveComponent } from './list-Control_Componentes_de_la_Aeronave/list-Control_Componentes_de_la_Aeronave.component';
import { ShowAdvanceFilterControl_Componentes_de_la_AeronaveComponent } from './show-advance-filter-Control_Componentes_de_la_Aeronave/show-advance-filter-Control_Componentes_de_la_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListControl_Componentes_de_la_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Control_Componentes_de_la_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Control_Componentes_de_la_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Control_Componentes_de_la_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterControl_Componentes_de_la_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Control_Componentes_de_la_AeronaveRoutingModule {
 }

