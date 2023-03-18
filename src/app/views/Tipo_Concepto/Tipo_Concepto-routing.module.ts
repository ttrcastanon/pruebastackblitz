import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_ConceptoComponent } from './Tipo_Concepto-add-edit/Tipo_Concepto.component';
import { ListTipo_ConceptoComponent } from './list-Tipo_Concepto/list-Tipo_Concepto.component';
import { ShowAdvanceFilterTipo_ConceptoComponent } from './show-advance-filter-Tipo_Concepto/show-advance-filter-Tipo_Concepto.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_ConceptoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_ConceptoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_ConceptoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_ConceptoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_ConceptoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_ConceptoRoutingModule {
 }

