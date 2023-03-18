import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { ImpuestosComponent } from './Impuestos-add-edit/Impuestos.component';
import { ListImpuestosComponent } from './list-Impuestos/list-Impuestos.component';
import { ShowAdvanceFilterImpuestosComponent } from './show-advance-filter-Impuestos/show-advance-filter-Impuestos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListImpuestosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ImpuestosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ImpuestosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ImpuestosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterImpuestosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ImpuestosRoutingModule {
 }

