import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CalendarioRoutingModule } from './Calendario-routing.module';

import { ListCalendarioComponent } from './list-calendario/list-calendario.component';
import { SpartaneAccountService } from './../../api-services/spartane-account.service';

//import { ModalComponent } from './components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

FullCalendarModule.registerPlugins([
    dayGridPlugin
]);


@NgModule({
    declarations: [
        ListCalendarioComponent
    ],
    imports: [
        CommonModule,
        FullCalendarModule,
        RouterModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        CalendarioRoutingModule,
        NgxSpinnerModule
    ],
    providers: [SpartaneAccountService],
    exports: [
        ListCalendarioComponent
    ]
})
export class CalendarioModule { }
