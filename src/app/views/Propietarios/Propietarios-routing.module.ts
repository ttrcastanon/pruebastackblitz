import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { PropietariosComponent } from './Propietarios-add-edit/Propietarios.component';
import { ListPropietariosComponent } from './list-Propietarios/list-Propietarios.component';
import { ShowAdvanceFilterPropietariosComponent } from './show-advance-filter-Propietarios/show-advance-filter-Propietarios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPropietariosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: PropietariosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: PropietariosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: PropietariosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPropietariosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PropietariosRoutingModule {
 }

