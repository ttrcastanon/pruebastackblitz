import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

import { Notificacion_de_rechazo_al_ingreso_de_almacenRoutingModule } from '../Notificacion_de_rechazo_al_ingreso_de_almacen/Notificacion_de_rechazo_al_ingreso_de_almacen-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Notificacion_de_rechazo_al_ingreso_de_almacenComponent } from './Notificacion_de_rechazo_al_ingreso_de_almacen-add-edit/Notificacion_de_rechazo_al_ingreso_de_almacen.component';
import { ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent } from './list-Notificacion_de_rechazo_al_ingreso_de_almacen/list-Notificacion_de_rechazo_al_ingreso_de_almacen.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShowAdvanceFilterNotificacion_de_rechazo_al_ingreso_de_almacenComponent } from './show-advance-filter-Notificacion_de_rechazo_al_ingreso_de_almacen/show-advance-filter-Notificacion_de_rechazo_al_ingreso_de_almacen.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';

@NgModule({
  declarations: [Notificacion_de_rechazo_al_ingreso_de_almacenComponent,
    ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent,
    ShowAdvanceFilterNotificacion_de_rechazo_al_ingreso_de_almacenComponent],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTabsModule,
    MaterialFileInputModule,
    CKEditorModule,
    SharedModule,
    MatTooltipModule,
    MatMenuModule,
    Notificacion_de_rechazo_al_ingreso_de_almacenRoutingModule,
    NgxSpinnerModule,
    MatRadioModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Notificacion_de_rechazo_al_ingreso_de_almacenModule { }

