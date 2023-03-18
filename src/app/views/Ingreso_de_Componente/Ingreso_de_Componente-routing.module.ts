import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Ingreso_de_ComponenteComponent } from './Ingreso_de_Componente-add-edit/Ingreso_de_Componente.component';
import { ListIngreso_de_ComponenteComponent } from './list-Ingreso_de_Componente/list-Ingreso_de_Componente.component';
import { ShowAdvanceFilterIngreso_de_ComponenteComponent } from './show-advance-filter-Ingreso_de_Componente/show-advance-filter-Ingreso_de_Componente.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListIngreso_de_ComponenteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Ingreso_de_ComponenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Ingreso_de_ComponenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Ingreso_de_ComponenteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterIngreso_de_ComponenteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Ingreso_de_ComponenteRoutingModule {
 }

