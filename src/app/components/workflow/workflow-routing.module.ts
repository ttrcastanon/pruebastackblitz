import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { WorkflowTableComponent } from './workflow-table/workflow-table.component';
import { BusinessRulesComponent } from './business-rules/business-rules.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'workflow-list',
    pathMatch: 'full'
  }
   ,
   {
     path: 'workflow-list',
     component: WorkflowTableComponent,
    //  canActivate: [ AuthGuardService ]
   }
   ,
   {
     path: 'workflow-business',
     component: BusinessRulesComponent,
    //  canActivate: [ AuthGuardService ]
   }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule {}