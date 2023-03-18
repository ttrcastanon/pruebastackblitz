import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Medio_de_Comunicacion } from './Tipo_de_Medio_de_Comunicacion';


export class Medio_de_Comunicacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Tipo', [''])
    Tipo = null;
    Tipo_Tipo_de_Medio_de_Comunicacion: Tipo_de_Medio_de_Comunicacion;

     @FormField('Medio_de_Comunicacions', [''])
     Medio_de_Comunicacions: Medio_de_Comunicacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

