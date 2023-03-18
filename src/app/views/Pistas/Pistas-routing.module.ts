import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { PistasComponent } from './Pistas-add-edit/Pistas.component';
import { ListPistasComponent } from './list-Pistas/list-Pistas.component';
import { ShowAdvanceFilterPistasComponent } from './show-advance-filter-Pistas/show-advance-filter-Pistas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPistasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: PistasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: PistasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: PistasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPistasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PistasRoutingModule {
 }

