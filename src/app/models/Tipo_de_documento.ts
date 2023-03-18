import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_documento  extends BaseView {
    @FormField('Clave', [0, Validators.required])
    Clave = 0;
    @FormField('Descripcion', ['', Validators.required])
    Descripcion = '';
    @FormField('Formato_de_Ejemplo', [''])
    Formato_de_Ejemplo = null;
    @FormField('Formato_de_EjemploFile', [''])
    Formato_de_EjemploFile: FileInput = null;

     @FormField('Tipo_de_documentos', [''])
     Tipo_de_documentos: Tipo_de_documento[] = [];
        
}

