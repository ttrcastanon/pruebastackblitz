import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Control_de_ComponentesComponent } from './Control_de_Componentes-add-edit/Control_de_Componentes.component';
import { ListControl_de_ComponentesComponent } from './list-Control_de_Componentes/list-Control_de_Componentes.component';
import { ShowAdvanceFilterControl_de_ComponentesComponent } from './show-advance-filter-Control_de_Componentes/show-advance-filter-Control_de_Componentes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListControl_de_ComponentesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Control_de_ComponentesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Control_de_ComponentesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Control_de_ComponentesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterControl_de_ComponentesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Control_de_ComponentesRoutingModule {
 }

