import {
  Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export enum EmunMode {
  Add = 'Add',
  Edit = 'Edit',
  View = 'View'
}

export enum EnumType {
  Actions = 'Actions',
  Hide = 'Hide',
  Span = 'Span',
  Text = 'Text',
  Select = 'Select'
}

export class Column {
  def: string;
  pathsToGetValue?: string[];
  pathsToDisplayValue?: string[];
  hide?: boolean = false;
  viewType?: EnumType;
  header?: string;
  defaultValue?: any = null;
  editType?: EnumType;
  validators?: ValidatorFn | ValidatorFn[] | AbstractControlOptions;
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[];
  label?: string;
  placeholder?: string;
  options?: any[];
  captionOption?: string;
}

@Component({
  selector: 'app-multi-row-edit',
  templateUrl: './multi-row-edit.component.html',
  styleUrls: ['./multi-row-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiRowEditComponent),
      multi: true
    }
  ]
})
export class MultiRowEditComponent implements OnInit, ControlValueAccessor {

  form: FormGroup;
  EnumMode = EmunMode;
  EnumType = EnumType;
  debug: boolean = false;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  disabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  get formData(): FormArray {
    return this.form.get('data') as FormArray;
  }

  _editMode: EmunMode = EmunMode.View;
  setEditMode(mode: EmunMode) {
    this._editMode = mode;
  }

  getPathValue(element: any, path: string, defaultValue?: any): any {
    const stringToPath = (path) => {
      if (typeof path !== 'string') return path;
      var output = [];
      path.split('.').forEach(function (item, index) {
        item.split(/\[([^}]+)\]/g).forEach(function (key) {
          if (key.length > 0) {
            output.push(key);
          }
        });
      });
      return output;
    };
    path = stringToPath(path);
    var current = element;
    for (var i = 0; i < path.length; i++) {
      if (!current.hasOwnProperty(path[i])) return defaultValue;
      current = current[path[i]];
    }
    return current;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (control.status !== 'VALID') {
          control.markAsTouched({ onlySelf: true });
        }
      } else if ((control as FormArray).controls[0] as FormGroup) {
        this.validateAllFormFields(((control as FormArray).controls[0] as FormGroup));
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  @ViewChild('table', { static: true }) table;

  // Input: Title
  @Input() public title: string;
  // Input: Columns
  _columns: Column[];
  get columns(): Column[] {
    return this._columns;
  }
  @Input() set columns(value: Column[]) {
    this._columns = value;
    this._columns.unshift({ def: 'actions', hide: false, header: 'Acciones', viewType: EnumType.Actions });
    this._columns.forEach(column => {
      if (!column.hide) {
        this.displayedColumns.push(column.def);
      }
    });
  }
  _data: any[];
  get data(): any[] {
    return this._data;
  }
  set data(value: any[]) {
    this._data = value;
    // Convert Array to FormArray
    this.form = this._formBuilder.group({
      data: this._formBuilder.array([])
    });
    const fromArray: FormArray = new FormArray([], Validators.compose(this.validators));
    if (this._data) {
      this._data.forEach(row => {
        const formGroup: FormGroup = new FormGroup({});
        this.columns.forEach(column => {
          if (column.viewType !== EnumType.Actions) {
            let value: any;
            if (column.pathsToGetValue) {
              column.pathsToGetValue.forEach(path => {
                if (!value) {
                  value = this.getPathValue(row, path);
                }
              });
            } else {
              value = row[column.def];
            }
            formGroup.addControl(column.def, new FormControl(value, column.validators, column.asyncValidator));
          }
        });
        fromArray.push(formGroup)
      });
    }
    this.form.setControl('data', fromArray);
    this.dataSource = new MatTableDataSource(this.formData.controls);
  }
  // Input: Bussiness Rules
  @Input() validators: ValidatorFn[];

  @Output() onDeleteMultiRowEdit: EventEmitter<any> = new EventEmitter();
  @Output() onSaveMultiRowEdit: EventEmitter<any> = new EventEmitter();
  @Output() onValidateErrorMultiRowEdit: EventEmitter<any> = new EventEmitter();
  @Output() onValidateSuccessMultiRowEdit: EventEmitter<any> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  writeValue(value: any[]): void {
    this.data = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getCellValue(element: any, column: Column): any {
    let value: any = element.value[column.def];
    if (!value || typeof (value) === 'object') {
      if (column.pathsToDisplayValue) {
        column.pathsToDisplayValue.forEach(path => {
          if (!value || typeof (value) === 'object') {
            value = this.getPathValue(value, path);
          }
        });
      }
    }
    return value;
  }

  onAddRowClick(event: Event) {
    event.stopPropagation();
    this.setEditMode(EmunMode.Add);
    const formGroup: FormGroup = new FormGroup({});
    this.columns.forEach(column => {
      if (column.viewType !== EnumType.Actions) {
        formGroup.addControl(column.def, new FormControl(column.defaultValue, column.validators, column.asyncValidator));
      }
    });
    this.formData.insert(0, formGroup);
    this.data = this.formData.controls.map(row => row.value);
    this.dataSource = new MatTableDataSource(this.formData.controls);
  }

  onCancelRowClick(event: Event) {
    event.stopPropagation();
    this.setEditMode(EmunMode.View);
    this.formData.removeAt(0);
    this.data = this.formData.controls.map(row => row.value);
    this.dataSource = new MatTableDataSource(this.formData.controls);
  }

  onSaveRowClick(event: Event) {
    event.stopPropagation();
    this.formData.updateValueAndValidity();
    const formGroup = this.formData.controls[0] as FormGroup;
    if (this.form.valid && this.formData.valid && formGroup.valid) {
      this.data = this.formData.controls.map(row => row.value);
      this.form.setValue({ data: this.data });
      if (this.onValidateSuccessMultiRowEdit) {
        this.onValidateSuccessMultiRowEdit.emit(formGroup.value);
      }
      if (this.onSaveMultiRowEdit) {
        this.onSaveMultiRowEdit.emit(formGroup.value);
      }
      this.setEditMode(EmunMode.View);
    } else {
      if (this.onValidateErrorMultiRowEdit) {
        this.onValidateErrorMultiRowEdit.emit({
          value: formGroup.value
          , errors: { ...formGroup.errors, ...this.form.errors, ...this.formData.errors }
        });
      }
      this.validateAllFormFields(formGroup);
    }
  }

  onDeleteRowClick(event: Event, row: FormGroup) {
    event.stopPropagation();
    this.setEditMode(EmunMode.View);
    const index = this.formData.controls.indexOf(row);
    this.formData.removeAt(index);
    this.data = this.formData.controls.map(row => row.value);
    this.dataSource = new MatTableDataSource(this.formData.controls);
    this.form.setValue({ data: this.data });
    if (this.onDeleteMultiRowEdit) {
      this.onDeleteMultiRowEdit.emit(row);
    }
  }

  onValidateTable(event: Event) {
    event.stopPropagation();
    this.formData.updateValueAndValidity();
    const formGroup = this.formData.controls[0] as FormGroup;
    if (this.form.valid && this.formData.valid && formGroup.valid) {
      if (this.onValidateSuccessMultiRowEdit) {
        this.onValidateSuccessMultiRowEdit.emit(formGroup.value);
      }
    } else {
      if (this.onValidateErrorMultiRowEdit) {
        this.onValidateErrorMultiRowEdit.emit({
          value: formGroup.value
          , errors: { ...formGroup.errors, ...this.form.errors, ...this.formData.errors }
        });
      }
      this.validateAllFormFields(formGroup);
    }
  }

}