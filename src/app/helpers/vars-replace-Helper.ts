import { Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { StorageService } from '../shared/services/storage.service';
import { LocalStorageHelper } from './local-storage-helper';


export class varsReplace {

    constructor(public injector: Injector) {
    }


    // formulario: Instancia del formulario activo
    // text: query
    static ReplaceFLD(formulario: FormGroup, text: string): string {

        var regExp = /FLD\[([^\]]+)\]/;
        var matches = regExp.exec(text);

        var nameOfVar;
        var valueOfVar;

        while (matches != null) {

            valueOfVar = '';
            nameOfVar = '';

            nameOfVar = matches[1];

            switch (typeof formulario.get(matches[1])?.value) {

                case "boolean":
                    if (formulario.get(matches[1])?.value)
                        valueOfVar = '1';
                    else
                        valueOfVar = '0';
                    break;
                case "number":
                    valueOfVar = formulario.get(matches[1])?.value;
                    break;
                case "string":
                    let esFecha = moment(formulario.get(matches[1])?.value).isValid();
                    if (esFecha) {
                        const _fecha = moment(formulario.get(matches[1])?.value);
                        let fechaFormat = _fecha.format('DD-MM-YYYY');
                        valueOfVar = fechaFormat;
                    }

                    let esMoneda = formulario.get(matches[1])?.value.toString().indexOf('$')

                    if (esMoneda == 0) {

                        esMoneda = -1;
                        esMoneda = formulario.get(matches[1])?.value.toString().indexOf('.')

                        if (esMoneda >= 0) {

                            valueOfVar = formulario.get(matches[1])?.value.toString();
                            valueOfVar = valueOfVar.replace(/,/g, '');
                            valueOfVar = valueOfVar.replace(/\$/g, '');
                        }
                    } else {
                        valueOfVar = formulario.get(matches[1])?.value.toString();
                    }

                    break;
                default:
                    valueOfVar = formulario.get(matches[1])?.value;
                    break;
            }

            text = text.replace(matches[0], valueOfVar);
            text = text.replace("\'null\'", '');
            text = text.replace("\'null\'", "\'\'");

            if (text.indexOf("(,") > 0) {
                text = text.replace('(,', '(');
            }

            matches = regExp.exec(text);
        }

        return text;
    }

    // formulario: Instancia del formulario activo
    // control: nombre del control existente dentro del formulario proporcionado
    // value: nuevo valor pra asignar al control
    static ReplaceFLDP(formulario: FormGroup, text: string): string {

        let nameOfVar: string = '';
        let valueOfVar: string = '';

        var regExp = /FLDP\[([^\]]+)\]/;
        var matches = regExp.exec(text);

        while (matches != null) {

            valueOfVar = '';
            nameOfVar = '';

            nameOfVar = matches[1];
            valueOfVar = formulario.get(matches[1])?.value;
            text = text.replace(matches[0], valueOfVar);
            matches = regExp.exec(text)
        }

        return text;
    }


    // formulario: Instancia del formulario activo
    // text: query
    static ReplaceFLDD(formulario: FormGroup, text: string): string {

        let nameOfVar: string = '';
        let valueOfVar: string = '';
        let controlDom: any = ''

        var regExp = /FLDD\[([^\]]+)\]/;
        var matches = regExp.exec(text);

        while (matches != null) {

            valueOfVar = '';
            nameOfVar = '';
            controlDom = '';

            nameOfVar = matches[1];

            controlDom = document.querySelector(`[formControlName=${nameOfVar}]`);


            if (controlDom && controlDom.selectedIndex >= 0) {
                valueOfVar = controlDom[controlDom.selectedIndex].text;
            } else {
                valueOfVar = '';
            }

            nameOfVar = matches[1];
            text = text.replace(matches[0], valueOfVar);
            matches = regExp.exec(text)
        }

        return text;
    }

    public static ReplaceGlobal(text: string): string {

        const injector = Injector.create({
            providers: [
                { provide: LocalStorageHelper },
                { provide: StorageService }
            ],
        });

        const localStorageHelper: LocalStorageHelper = injector.get(LocalStorageHelper);

        let nameOfVar: string = '';
        let valueOfVar: string = '';

        var regExp = /GLOBAL\[([^\]]+)\]/;
        var matches = regExp.exec(text);

        while (matches != null) {
            nameOfVar = matches[1];
            valueOfVar = localStorageHelper.getItemFromLocalStorage(nameOfVar);
            text = text.replace(matches[0], valueOfVar);
            matches = regExp.exec(text);
        }
        //console.log('Data GLOBAL', text);
        return text;
    }

    public static RaplceVarsAll(formulario: FormGroup, text: string) {

        let data: string = text;
        if (formulario != null) {
            data = this.ReplaceFLD(formulario, data);
            data = this.ReplaceFLDD(formulario, data);
            data = this.ReplaceFLDP(formulario, data);
        }
        data = this.ReplaceGlobal(data);
        return data;
    }

}
