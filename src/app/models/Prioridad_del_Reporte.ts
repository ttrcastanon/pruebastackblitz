import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Prioridad_del_Reporte  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Prioridad_del_Reportes', [''])
     Prioridad_del_Reportes: Prioridad_del_Reporte[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

