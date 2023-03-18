import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Condicion_del_itemComponent } from './Condicion_del_item-add-edit/Condicion_del_item.component';
import { ListCondicion_del_itemComponent } from './list-Condicion_del_item/list-Condicion_del_item.component';
import { ShowAdvanceFilterCondicion_del_itemComponent } from './show-advance-filter-Condicion_del_item/show-advance-filter-Condicion_del_item.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCondicion_del_itemComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Condicion_del_itemComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Condicion_del_itemComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Condicion_del_itemComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCondicion_del_itemComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Condicion_del_itemRoutingModule {
 }

