﻿import { NgxSpinnerModule } from 'ngx-spinner';
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

import { Ejecucion_de_VueloRoutingModule } from '../Ejecucion_de_Vuelo/Ejecucion_de_Vuelo-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Ejecucion_de_VueloComponent } from './Ejecucion_de_Vuelo-add-edit/Ejecucion_de_Vuelo.component';
import { ListEjecucion_de_VueloComponent } from './list-Ejecucion_de_Vuelo/list-Ejecucion_de_Vuelo.component';
import { ModalEjecucionDeVueloComponent } from './modal-ejecucion-de-vuelo/modal-ejecucion-de-vuelo.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { ShowAdvanceFilterEjecucion_de_VueloComponent } from './show-advance-filter-Ejecucion_de_Vuelo/show-advance-filter-Ejecucion_de_Vuelo.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';

@NgModule({
  declarations: [Ejecucion_de_VueloComponent,
    ListEjecucion_de_VueloComponent,
    ShowAdvanceFilterEjecucion_de_VueloComponent,
    ModalEjecucionDeVueloComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ejecucion_de_VueloRoutingModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    MaterialFileInputModule,
    CKEditorModule,
    SharedModule,
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
    MatTooltipModule,
    MatMenuModule,
    MatRadioModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Ejecucion_de_VueloModule { }

