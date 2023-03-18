import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { ColoresComponent } from './Colores-add-edit/Colores.component';
import { ListColoresComponent } from './list-Colores/list-Colores.component';
import { ShowAdvanceFilterColoresComponent } from './show-advance-filter-Colores/show-advance-filter-Colores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListColoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ColoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ColoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ColoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterColoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ColoresRoutingModule {
 }

