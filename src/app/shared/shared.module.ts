import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DisableDirective } from './directives/disable.directive';
import { HtmlEditorDialogComponent } from './views/dialogs/html-editor-dialog/html-editor-dialog.component';
import { DialogPrintFormatComponent } from './views/dialogs/dialog-print-format/dialog-print-format.component';
import { DialogConfirmExportComponent } from './views/dialogs/dialog-confirm-export/dialog-confirm-export.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiRowEditComponent } from './components/multi-row-edit/multi-row-edit.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { MatInputOnlyNumbersDirective } from './directives/mat-input-only-numbers.directive';
import { NgSelectFormFieldControlDirective } from 'src/app/shared/directives/ng-select.directive';

@NgModule({
  declarations: [
    DisableDirective,
    HtmlEditorDialogComponent,
    DialogPrintFormatComponent,
    DialogConfirmExportComponent,
    MultiRowEditComponent,
    NumbersOnlyDirective,
    MatInputOnlyNumbersDirective,
    NgSelectFormFieldControlDirective
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgxMaskModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule],
  exports: [
    CommonModule,
    TranslateModule,
    NgxMaskModule,
    MatSnackBarModule,
    DisableDirective,
    DialogPrintFormatComponent,
    DialogConfirmExportComponent,
    MultiRowEditComponent,
    MatInputOnlyNumbersDirective,
    NgSelectFormFieldControlDirective

  ]
})
export class SharedModule { }
