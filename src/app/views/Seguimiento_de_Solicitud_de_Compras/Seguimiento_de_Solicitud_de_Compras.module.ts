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

import { Seguimiento_de_Solicitud_de_ComprasRoutingModule } from '../Seguimiento_de_Solicitud_de_Compras/Seguimiento_de_Solicitud_de_Compras-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Seguimiento_de_Solicitud_de_ComprasComponent } from './Seguimiento_de_Solicitud_de_Compras-add-edit/Seguimiento_de_Solicitud_de_Compras.component';
import { ListSeguimiento_de_Solicitud_de_ComprasComponent } from './list-Seguimiento_de_Solicitud_de_Compras/list-Seguimiento_de_Solicitud_de_Compras.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShowAdvanceFilterSeguimiento_de_Solicitud_de_ComprasComponent } from './show-advance-filter-Seguimiento_de_Solicitud_de_Compras/show-advance-filter-Seguimiento_de_Solicitud_de_Compras.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [Seguimiento_de_Solicitud_de_ComprasComponent,
    ListSeguimiento_de_Solicitud_de_ComprasComponent,
    ShowAdvanceFilterSeguimiento_de_Solicitud_de_ComprasComponent],
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
    Seguimiento_de_Solicitud_de_ComprasRoutingModule,
    NgxSpinnerModule,
    MatRadioModule,
    NgSelectModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Seguimiento_de_Solicitud_de_ComprasModule { }

