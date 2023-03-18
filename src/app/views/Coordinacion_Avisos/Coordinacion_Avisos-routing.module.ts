import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Coordinacion_AvisosComponent } from './Coordinacion_Avisos-add-edit/Coordinacion_Avisos.component';
import { ListCoordinacion_AvisosComponent } from './list-Coordinacion_Avisos/list-Coordinacion_Avisos.component';
import { ShowAdvanceFilterCoordinacion_AvisosComponent } from './show-advance-filter-Coordinacion_Avisos/show-advance-filter-Coordinacion_Avisos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCoordinacion_AvisosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Coordinacion_AvisosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Coordinacion_AvisosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Coordinacion_AvisosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCoordinacion_AvisosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Coordinacion_AvisosRoutingModule {
 }

