import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Detalle_Tabla_de_Control_de_ComponentesComponent } from './Detalle_Tabla_de_Control_de_Componentes-add-edit/Detalle_Tabla_de_Control_de_Componentes.component';
import { ListDetalle_Tabla_de_Control_de_ComponentesComponent } from './list-Detalle_Tabla_de_Control_de_Componentes/list-Detalle_Tabla_de_Control_de_Componentes.component';
import { ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent } from './show-advance-filter-Detalle_Tabla_de_Control_de_Componentes/show-advance-filter-Detalle_Tabla_de_Control_de_Componentes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDetalle_Tabla_de_Control_de_ComponentesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Detalle_Tabla_de_Control_de_ComponentesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Detalle_Tabla_de_Control_de_ComponentesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Detalle_Tabla_de_Control_de_ComponentesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Detalle_Tabla_de_Control_de_ComponentesRoutingModule {
 }

