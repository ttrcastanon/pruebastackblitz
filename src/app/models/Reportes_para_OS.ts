import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Reportes_para_OS  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Reporte_de_OS', [''])
    Reporte_de_OS = '';

     @FormField('Reportes_para_OSs', [''])
     Reportes_para_OSs: Reportes_para_OS[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

