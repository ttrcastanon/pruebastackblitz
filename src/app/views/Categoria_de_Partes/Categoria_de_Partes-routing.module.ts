import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Categoria_de_PartesComponent } from './Categoria_de_Partes-add-edit/Categoria_de_Partes.component';
import { ListCategoria_de_PartesComponent } from './list-Categoria_de_Partes/list-Categoria_de_Partes.component';
import { ShowAdvanceFilterCategoria_de_PartesComponent } from './show-advance-filter-Categoria_de_Partes/show-advance-filter-Categoria_de_Partes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCategoria_de_PartesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Categoria_de_PartesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Categoria_de_PartesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Categoria_de_PartesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCategoria_de_PartesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Categoria_de_PartesRoutingModule {
 }

