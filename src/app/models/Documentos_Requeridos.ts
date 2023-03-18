import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Documentos_Requeridos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Nombre_de_Documento', [''])
    Nombre_de_Documento = '';

     @FormField('Documentos_Requeridoss', [''])
     Documentos_Requeridoss: Documentos_Requeridos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

