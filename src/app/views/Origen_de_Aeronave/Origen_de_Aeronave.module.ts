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

import { Origen_de_AeronaveRoutingModule } from '../Origen_de_Aeronave/Origen_de_Aeronave-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Origen_de_AeronaveComponent } from './Origen_de_Aeronave-add-edit/Origen_de_Aeronave.component';
import { ListOrigen_de_AeronaveComponent } from './list-Origen_de_Aeronave/list-Origen_de_Aeronave.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShowAdvanceFilterOrigen_de_AeronaveComponent } from './show-advance-filter-Origen_de_Aeronave/show-advance-filter-Origen_de_Aeronave.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';

@NgModule({
  declarations: [Origen_de_AeronaveComponent,
    ListOrigen_de_AeronaveComponent,
    ShowAdvanceFilterOrigen_de_AeronaveComponent],
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
    Origen_de_AeronaveRoutingModule,
    NgxSpinnerModule,
    MatRadioModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Origen_de_AeronaveModule { }

