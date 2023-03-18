import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Documentos_RequeridosComponent } from './Documentos_Requeridos-add-edit/Documentos_Requeridos.component';
import { ListDocumentos_RequeridosComponent } from './list-Documentos_Requeridos/list-Documentos_Requeridos.component';
import { ShowAdvanceFilterDocumentos_RequeridosComponent } from './show-advance-filter-Documentos_Requeridos/show-advance-filter-Documentos_Requeridos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDocumentos_RequeridosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Documentos_RequeridosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Documentos_RequeridosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Documentos_RequeridosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDocumentos_RequeridosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Documentos_RequeridosRoutingModule {
 }

