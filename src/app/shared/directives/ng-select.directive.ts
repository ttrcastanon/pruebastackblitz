import { MatFormFieldControl } from '@angular/material/form-field';
import { Directive, HostBinding, Input, Optional, Self, OnDestroy, DoCheck } from '@angular/core';
import { Subject } from 'rxjs';
import { NgControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ErrorStateMatcher } from '@angular/material/core';


export class NgSelectErrorStateMatcher {
    constructor(private ngSelect: NgSelectFormFieldControlDirective) {
    }
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        if (!control) {
            return this.ngSelect.required && this.ngSelect.empty;
        } else {
            return !!(control && control.invalid && (control.touched || (form && form.submitted)));
        }
    }
}

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'ng-select[ngSelectMat]',
    providers: [{ provide: MatFormFieldControl, useExisting: NgSelectFormFieldControlDirective }],
})
export class NgSelectFormFieldControlDirective implements MatFormFieldControl<any>, OnDestroy, DoCheck {

    static nextId = 0;
    errorState = false;
    private _defaultErrorStateMatcher: ErrorStateMatcher = new NgSelectErrorStateMatcher(this);
    stateChanges = new Subject<void>();
    focused = false;
    private _placeholder: string;
    private _required = false;
    private _value: any;
    private _disabled: boolean = false;


    @Input() errorStateMatcher: ErrorStateMatcher;

    @HostBinding() @Input() id = `ng-select-${NgSelectFormFieldControlDirective.nextId++}`;
    @HostBinding('attr.aria-describedby') describedBy = '';

    constructor(
        private host: NgSelectComponent,
        @Optional() @Self() public ngControl: NgControl,
        @Optional() private _parentForm: NgForm,
        @Optional() private _parentFormGroup: FormGroupDirective,
    ) {
               
        host.focusEvent.asObservable().pipe(untilDestroyed(this)).subscribe(v => {
            this.focused = true;
            this.stateChanges.next();
        });
        host.blurEvent.asObservable().pipe(untilDestroyed(this)).subscribe(v => {
            this.focused = false;
            this.stateChanges.next();
        });


        if (this.ngControl) {
            this._value = this.ngControl.value;
            if (this.ngControl.disabled != null) {
                this._disabled = this.ngControl.disabled;
            }
            this?.ngControl?.statusChanges?.pipe(untilDestroyed(this)).subscribe(s => {
                const disabled = s === 'DISABLED';
                if (disabled !== this._disabled) {
                    this._disabled = disabled;
                    this.stateChanges.next();
                }
            });
            this.ngControl.valueChanges?.pipe(untilDestroyed(this)).subscribe(v => {
                this._value = v;
                this.stateChanges.next();
            });
        } else {
            host.changeEvent.asObservable().pipe(untilDestroyed(this)).subscribe(v => {
                this._value = v;
                this.stateChanges.next();
            });
        }
    }


    get empty(): boolean {
        return (this._value === undefined || this._value === null)
            || (this.host.multiple && this._value.length === 0);
    }

    get shouldLabelFloat() {
        return this.focused || !this.empty || !!(this.host.filter && this.host.filter.length);
    }

    @Input()
    get placeholder(): string { return this._placeholder; }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }

    @Input()
    get required(): boolean { return this._required; }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    @Input()
    get value(): any {
        return this._value;
    }
    set value(v: any) {
        this._value = v;
        this.stateChanges.next();
    }

    ngOnDestroy() { }

    ngDoCheck() {
        this.updateErrorState();
    }

    updateErrorState() {
        const oldState = this.errorState;
        const parent = this._parentFormGroup || this._parentForm;
        const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
        const control = this.ngControl ? this.ngControl.control as FormControl : null;
        const newState = matcher.isErrorState(control, parent);

        if (newState !== oldState) {
            this.errorState = newState;
            this.stateChanges.next();
        }
    }

    setDescribedByIds(ids: string[]): void {
        if (ids) {
            this.describedBy = ids.join(' ');
        }
    }

    onContainerClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains('mat-form-field-infix')) {
            this.host.focus();
            this.host.open();
        }

    }

}
