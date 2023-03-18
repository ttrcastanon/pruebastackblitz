import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipos_de_Origen_del_ComponenteComponent } from './Tipos_de_Origen_del_Componente-add-edit/Tipos_de_Origen_del_Componente.component';
import { ListTipos_de_Origen_del_ComponenteComponent } from './list-Tipos_de_Origen_del_Componente/list-Tipos_de_Origen_del_Componente.component';
import { ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent } from './show-advance-filter-Tipos_de_Origen_del_Componente/show-advance-filter-Tipos_de_Origen_del_Componente.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipos_de_Origen_del_ComponenteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipos_de_Origen_del_ComponenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipos_de_Origen_del_ComponenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipos_de_Origen_del_ComponenteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipos_de_Origen_del_ComponenteRoutingModule {
 }

