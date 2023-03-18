import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Folios_Generacion_OCComponent } from './Folios_Generacion_OC-add-edit/Folios_Generacion_OC.component';
import { ListFolios_Generacion_OCComponent } from './list-Folios_Generacion_OC/list-Folios_Generacion_OC.component';
import { ShowAdvanceFilterFolios_Generacion_OCComponent } from './show-advance-filter-Folios_Generacion_OC/show-advance-filter-Folios_Generacion_OC.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListFolios_Generacion_OCComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Folios_Generacion_OCComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Folios_Generacion_OCComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Folios_Generacion_OCComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterFolios_Generacion_OCComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Folios_Generacion_OCRoutingModule {
 }

