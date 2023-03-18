import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Catalago_Manual_de_UsuarioComponent } from './Catalago_Manual_de_Usuario-add-edit/Catalago_Manual_de_Usuario.component';
import { ListCatalago_Manual_de_UsuarioComponent } from './list-Catalago_Manual_de_Usuario/list-Catalago_Manual_de_Usuario.component';
import { ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent } from './show-advance-filter-Catalago_Manual_de_Usuario/show-advance-filter-Catalago_Manual_de_Usuario.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCatalago_Manual_de_UsuarioComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Catalago_Manual_de_UsuarioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Catalago_Manual_de_UsuarioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Catalago_Manual_de_UsuarioComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Catalago_Manual_de_UsuarioRoutingModule {
 }

