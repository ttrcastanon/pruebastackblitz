import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Gestion_de_ExportacionComponent } from './Gestion_de_Exportacion-add-edit/Gestion_de_Exportacion.component';
import { ListGestion_de_ExportacionComponent } from './list-Gestion_de_Exportacion/list-Gestion_de_Exportacion.component';
import { ShowAdvanceFilterGestion_de_ExportacionComponent } from './show-advance-filter-Gestion_de_Exportacion/show-advance-filter-Gestion_de_Exportacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListGestion_de_ExportacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Gestion_de_ExportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Gestion_de_ExportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Gestion_de_ExportacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterGestion_de_ExportacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Gestion_de_ExportacionRoutingModule {
 }

