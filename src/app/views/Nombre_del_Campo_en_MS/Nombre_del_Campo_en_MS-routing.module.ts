import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Nombre_del_Campo_en_MSComponent } from './Nombre_del_Campo_en_MS-add-edit/Nombre_del_Campo_en_MS.component';
import { ListNombre_del_Campo_en_MSComponent } from './list-Nombre_del_Campo_en_MS/list-Nombre_del_Campo_en_MS.component';
import { ShowAdvanceFilterNombre_del_Campo_en_MSComponent } from './show-advance-filter-Nombre_del_Campo_en_MS/show-advance-filter-Nombre_del_Campo_en_MS.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListNombre_del_Campo_en_MSComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Nombre_del_Campo_en_MSComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Nombre_del_Campo_en_MSComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Nombre_del_Campo_en_MSComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterNombre_del_Campo_en_MSComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Nombre_del_Campo_en_MSRoutingModule {
 }

