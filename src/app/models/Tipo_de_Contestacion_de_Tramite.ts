import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Subtramite } from './Subtramite';


export class Tipo_de_Contestacion_de_Tramite  extends BaseView {
    @FormField('Clave', [0, Validators.required])
    Clave = 0;
    @FormField('Descripcion', ['', Validators.required])
    Descripcion = '';
    @FormField('Subtramite', [''])
    Subtramite = null;
    Subtramite_Subtramite: Subtramite;
    @FormField('Generar_Rechazo', [false])
    Generar_Rechazo = false;

     @FormField('Tipo_de_Contestacion_de_Tramites', [''])
     Tipo_de_Contestacion_de_Tramites: Tipo_de_Contestacion_de_Tramite[] = [];
        
}

