import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Documentacion_de_AeronaveComponent } from './Documentacion_de_Aeronave-add-edit/Documentacion_de_Aeronave.component';
import { ListDocumentacion_de_AeronaveComponent } from './list-Documentacion_de_Aeronave/list-Documentacion_de_Aeronave.component';
import { ShowAdvanceFilterDocumentacion_de_AeronaveComponent } from './show-advance-filter-Documentacion_de_Aeronave/show-advance-filter-Documentacion_de_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDocumentacion_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Documentacion_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Documentacion_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Documentacion_de_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDocumentacion_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Documentacion_de_AeronaveRoutingModule {
 }

