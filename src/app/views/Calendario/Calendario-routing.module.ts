import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { ListCalendarioComponent } from './list-calendario/list-calendario.component';


const routes: Routes = [
    {
        path: 'list',
        component: ListCalendarioComponent,
        canActivate: [AuthGuardService]
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class CalendarioRoutingModule {
}

