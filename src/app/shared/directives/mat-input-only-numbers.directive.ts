import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

@Directive({
  selector: 'input[matInputOnlyNumbers]',
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatInputOnlyNumbersDirective },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatInputOnlyNumbersDirective),
      multi: true,
    }
  ]
})
export class MatInputOnlyNumbersDirective {

  readonly minusSign: string = '-';

  // private _value: string | null;
  // @Input('value')
  // set value(value: string | null) {
  //   this._value = value;
  // }
  // get value(): string | null {
  //   return this._value;
  // }

  @Input() allowDecimals: boolean = false;
  @Input() allowSign: boolean = false;
  @Input() allowLeadingZeros: boolean = false;
  @Input() decimalSeparator: string = '.';
  @Input() decimalNumbers: number = 2;

  integerUnsigned: string = '^[0-9]*$';
  integerSigned: string = '^-?[0-9]+$';
  decimalUnsigned: string = `^[0-9]+(.[0-9]{1, ${this.decimalNumbers}}})?$`;
  decimalSigned: string = `^-?[0-9]+(.[0-9]{1, ${this.decimalNumbers}}})?$`;

  constructor(private elementRef: ElementRef<HTMLInputElement>) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this.validateValue(value);
  }

  _onChange(value: any): void {
  }

  writeValue(value: any) {
    this._onChange(value);
    this.validateValue(value);
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched() {
  }

  validateValue(value: string): void {
    if (!value) return;

    // choose the appropiate regular expression
    let regex: string = this.integerUnsigned;
    if (!this.allowDecimals && !this.allowSign) regex = this.integerUnsigned;
    if (!this.allowDecimals && this.allowSign) regex = this.integerSigned;
    if (this.allowDecimals && !this.allowSign) regex = this.decimalUnsigned;
    if (this.allowDecimals && this.allowSign) regex = this.decimalSigned;

    // when a numbers begins with a decimal separator,
    // fix it adding a zero in the beginning
    let firstCharacter = value.toString().charAt(0);
    if (firstCharacter == this.decimalSeparator) value = 0 + value;

    // when a numbers ends with a decimal separator,
    // fix it adding a zero in the end
    let lastCharacter = value.toString().charAt(value.toString().length - 1);
    if (lastCharacter == this.decimalSeparator) value = value + 0;

    if (!this.allowLeadingZeros) {
      //remove unnececary leading zeros
      let signedValue = false;
      if (firstCharacter == this.minusSign) {
        //test for 0's without the sing interuption (avoid -004)
        signedValue = true;
        value = value.toString().substring(1);
        firstCharacter = value.toString().charAt(0);
      }
      let secondChar = value.toString().charAt(1);
      while (
        firstCharacter == '0' &&
        secondChar != '' &&
        secondChar != this.decimalSeparator
      ) {
        value = value.toString().substring(1);
        firstCharacter = value.toString().charAt(0);
        secondChar = value.toString().charAt(1);
      }
      if (signedValue == true) {
        //return the minus value if required
        value = this.minusSign + value;
      }
    }

    //test for excess zeros following the decimal point
    let valueParts = value.toString().split(this.decimalSeparator);
    let naturalPart = valueParts?.[0];
    let decimalPart = valueParts?.[1];

    //remove unnececary zeros after decimal part
    if (decimalPart != null && /^0+$/.test(decimalPart)) {
      decimalPart = '0';
      value = naturalPart + '.' + decimalPart;
    }

    //test for -0.0 or -0
    if (value == '-0') {
      value = '0';
    }
    if (value == '-0.0') {
      value = '0.0';
    }
    // if (/^-?0(\.0*)*$/.test(value)) {
    //   value = '0';
    // }

    // test number with regular expression, when
    // number is invalid, replace it with a zero
    let valid: boolean = new RegExp(regex).test(value);
    this.elementRef.nativeElement['value'] = valid ? value : '';
    this._onChange(valid ? value : '')
  }

  getName(e: any): string {
    if (e.key) {
      return e.key;
    } else {
      // for old browsers
      if (e.keyCode && String.fromCharCode) {
        switch (e.keyCode) {
          case 8:
            return 'Backspace';
          case 9:
            return 'Tab';
          case 27:
            return 'Escape';
          case 37:
            return 'ArrowLeft';
          case 39:
            return 'ArrowRight';
          case 188:
            return ',';
          case 190:
            return '.';
          case 109:
            return '-'; // minus in numbpad
          case 173:
            return '-'; // minus in alphabet keyboard in firefox
          case 189:
            return '-'; // minus in alphabet keyboard in chrome
          default:
            return String.fromCharCode(e.keyCode);
        }
      }
      return String.fromCharCode(e.keyCode);
    }
  }

}