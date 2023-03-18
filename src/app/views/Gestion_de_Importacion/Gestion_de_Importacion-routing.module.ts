import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Gestion_de_ImportacionComponent } from './Gestion_de_Importacion-add-edit/Gestion_de_Importacion.component';
import { ListGestion_de_ImportacionComponent } from './list-Gestion_de_Importacion/list-Gestion_de_Importacion.component';
import { ShowAdvanceFilterGestion_de_ImportacionComponent } from './show-advance-filter-Gestion_de_Importacion/show-advance-filter-Gestion_de_Importacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListGestion_de_ImportacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Gestion_de_ImportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Gestion_de_ImportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Gestion_de_ImportacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterGestion_de_ImportacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Gestion_de_ImportacionRoutingModule {
 }

