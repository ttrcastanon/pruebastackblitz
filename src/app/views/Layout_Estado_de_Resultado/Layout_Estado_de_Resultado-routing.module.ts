import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_Estado_de_ResultadoComponent } from './Layout_Estado_de_Resultado-add-edit/Layout_Estado_de_Resultado.component';
import { ListLayout_Estado_de_ResultadoComponent } from './list-Layout_Estado_de_Resultado/list-Layout_Estado_de_Resultado.component';
import { ShowAdvanceFilterLayout_Estado_de_ResultadoComponent } from './show-advance-filter-Layout_Estado_de_Resultado/show-advance-filter-Layout_Estado_de_Resultado.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_Estado_de_ResultadoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_Estado_de_ResultadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_Estado_de_ResultadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_Estado_de_ResultadoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_Estado_de_ResultadoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_Estado_de_ResultadoRoutingModule {
 }

