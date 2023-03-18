import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Nombre_del_Campo_en_MS  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Nombre_Fisico_del_Campo', [''])
    Nombre_Fisico_del_Campo = '';
    @FormField('Nombre_Fisico_de_la_Tabla', [''])
    Nombre_Fisico_de_la_Tabla = '';

     @FormField('Nombre_del_Campo_en_MSs', [''])
     Nombre_del_Campo_en_MSs: Nombre_del_Campo_en_MS[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

