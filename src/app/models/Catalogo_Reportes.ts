import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Respuesta } from './Respuesta';


export class Catalogo_Reportes  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Nombre', [''])
    Nombre = '';
    @FormField('IDReporte', [''])
    IDReporte = null;
    IDReporte_Respuesta: Respuesta;

     @FormField('Catalogo_Reportess', [''])
     Catalogo_Reportess: Catalogo_Reportes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

