import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Existencia_solicitud_crear_reporte  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Existencia', [''])
    Existencia = '';

     @FormField('Existencia_solicitud_crear_reportes', [''])
     Existencia_solicitud_crear_reportes: Existencia_solicitud_crear_reporte[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

