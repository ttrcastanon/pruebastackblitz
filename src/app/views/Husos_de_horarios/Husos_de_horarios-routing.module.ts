import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Husos_de_horariosComponent } from './Husos_de_horarios-add-edit/Husos_de_horarios.component';
import { ListHusos_de_horariosComponent } from './list-Husos_de_horarios/list-Husos_de_horarios.component';
import { ShowAdvanceFilterHusos_de_horariosComponent } from './show-advance-filter-Husos_de_horarios/show-advance-filter-Husos_de_horarios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListHusos_de_horariosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Husos_de_horariosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Husos_de_horariosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Husos_de_horariosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterHusos_de_horariosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Husos_de_horariosRoutingModule {
 }

