import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Costos_de_ImportacionComponent } from './Costos_de_Importacion-add-edit/Costos_de_Importacion.component';
import { ListCostos_de_ImportacionComponent } from './list-Costos_de_Importacion/list-Costos_de_Importacion.component';
import { ShowAdvanceFilterCostos_de_ImportacionComponent } from './show-advance-filter-Costos_de_Importacion/show-advance-filter-Costos_de_Importacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCostos_de_ImportacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Costos_de_ImportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Costos_de_ImportacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Costos_de_ImportacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCostos_de_ImportacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Costos_de_ImportacionRoutingModule {
 }

