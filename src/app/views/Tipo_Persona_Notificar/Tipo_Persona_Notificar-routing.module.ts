import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_Persona_NotificarComponent } from './Tipo_Persona_Notificar-add-edit/Tipo_Persona_Notificar.component';
import { ListTipo_Persona_NotificarComponent } from './list-Tipo_Persona_Notificar/list-Tipo_Persona_Notificar.component';
import { ShowAdvanceFilterTipo_Persona_NotificarComponent } from './show-advance-filter-Tipo_Persona_Notificar/show-advance-filter-Tipo_Persona_Notificar.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_Persona_NotificarComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_Persona_NotificarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_Persona_NotificarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_Persona_NotificarComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_Persona_NotificarComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_Persona_NotificarRoutingModule {
 }

