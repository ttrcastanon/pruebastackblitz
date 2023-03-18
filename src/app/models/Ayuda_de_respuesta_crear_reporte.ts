import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Ayuda_de_respuesta_crear_reporte  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Respuesta_de_ayuda', [''])
    Respuesta_de_ayuda = '';

     @FormField('Ayuda_de_respuesta_crear_reportes', [''])
     Ayuda_de_respuesta_crear_reportes: Ayuda_de_respuesta_crear_reporte[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

