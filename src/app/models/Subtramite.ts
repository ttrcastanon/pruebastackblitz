import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
//@@Begin.Keep.Implementation('import { FileInput } from 'ngx-material-file-input';')
import { FileInput } from 'ngx-material-file-input';
import { Documento_Requerido_de_Subtramite } from './Documento_Requerido_de_Subtramite';
//@@End.Keep.Implementation('import { Tramite } from './Tramite';')
import { Tramite } from './Tramite';

export class Subtramite  extends BaseView {
    @FormField('Clave', [0, Validators.required])
    Clave = 0;
    @FormField('Descripcion', ['', Validators.required])
    Descripcion = '';
    @FormField('Tramite', [''])
    Tramite = null;
    Tramite_Tramite: Tramite;
    //@@Begin.Keep.Implementation('@FormField('Documento_Requerido_de_Subtramite')')
    @FormField('Documento_Requerido_de_Subtramite', [''])
    Documento_Requerido_de_Subtramite:Documento_Requerido_de_Subtramite = null;
    //@@End.Keep.Implementation('@FormField('Guia_de_ayuda')')
    @FormField('Guia_de_ayuda', [''])
    Guia_de_ayuda = null;
    @FormField('Guia_de_ayudaFile', [''])
    Guia_de_ayudaFile: FileInput = null;
    @FormField('Activo', [false])
    Activo = false;

     @FormField('Subtramites', [''])
     Subtramites: Subtramite[] = [];
        
}

