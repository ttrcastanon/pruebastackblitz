import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { ItemsComponent } from './Items-add-edit/Items.component';
import { ListItemsComponent } from './list-Items/list-Items.component';
import { ShowAdvanceFilterItemsComponent } from './show-advance-filter-Items/show-advance-filter-Items.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListItemsComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ItemsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ItemsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ItemsComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterItemsComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ItemsRoutingModule {
 }

