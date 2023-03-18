import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { InstalacionComponent } from './Instalacion-add-edit/Instalacion.component';
import { ListInstalacionComponent } from './list-Instalacion/list-Instalacion.component';
import { ShowAdvanceFilterInstalacionComponent } from './show-advance-filter-Instalacion/show-advance-filter-Instalacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListInstalacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: InstalacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: InstalacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: InstalacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterInstalacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class InstalacionRoutingModule {
 }

