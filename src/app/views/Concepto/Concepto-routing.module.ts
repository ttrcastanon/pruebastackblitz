import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { ConceptoComponent } from './Concepto-add-edit/Concepto.component';
import { ListConceptoComponent } from './list-Concepto/list-Concepto.component';
import { ShowAdvanceFilterConceptoComponent } from './show-advance-filter-Concepto/show-advance-filter-Concepto.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConceptoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ConceptoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ConceptoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ConceptoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConceptoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ConceptoRoutingModule {
 }

