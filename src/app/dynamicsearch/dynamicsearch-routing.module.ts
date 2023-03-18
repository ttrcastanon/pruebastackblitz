import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicSearchComponent } from './dynamicsearch/dynamicsearch.component';

import {AuthGuardService} from 'src/app/shared/services/auth-guard.service';
import { DynamicsearchtableComponent } from './dynamicsearchtable/dynamicsearchtable.component';
const routes: Routes = [
   {
     path: 'DynamicSearch/:id/:wf/:phase',
     component: DynamicSearchComponent,
     canActivate: [AuthGuardService]
   }
   ,
   {
    path: 'DynamicSearch/:id/:wf/:phase/:novuelo',
    component: DynamicSearchComponent,
    canActivate: [AuthGuardService]
  }
  ,
   {
     path: 'DynamicSearchtable',
     component: DynamicsearchtableComponent,
     canActivate: [AuthGuardService]
   }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicSearchRoutingModule {}
