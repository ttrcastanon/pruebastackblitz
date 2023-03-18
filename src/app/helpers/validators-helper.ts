
import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';


@Injectable({ providedIn: 'root' })

export class ValidatorsHelper {

    constructor(

    ) { }

    //#region Validar AutoComplete 
    autocompleteValidator(arrayOptions: Array<string>, nameElement: any): ValidatorFn {
        let validOptions: any[] = [];
        if (arrayOptions != undefined) {
            arrayOptions.forEach((element: any) => {
                validOptions.push(element[`${nameElement}`])
            });
        }


        return (control: AbstractControl): { [key: string]: any } | null => {
            if (validOptions.indexOf(control.value) !== -1) {
                return null
            }
            return { 'invalidAutocompleteString': { value: control.value } }
        }
    }
    //#endregion
}



