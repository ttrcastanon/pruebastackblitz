import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Horarios_de_TrabajoComponent } from './Horarios_de_Trabajo-add-edit/Horarios_de_Trabajo.component';
import { ListHorarios_de_TrabajoComponent } from './list-Horarios_de_Trabajo/list-Horarios_de_Trabajo.component';
import { ShowAdvanceFilterHorarios_de_TrabajoComponent } from './show-advance-filter-Horarios_de_Trabajo/show-advance-filter-Horarios_de_Trabajo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListHorarios_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Horarios_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Horarios_de_TrabajoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Horarios_de_TrabajoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterHorarios_de_TrabajoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Horarios_de_TrabajoRoutingModule {
 }

