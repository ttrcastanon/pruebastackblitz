import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Folios_Generacion_OC  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('FolioTexto', [''])
    FolioTexto = '';
    @FormField('Fecha', [''])
    Fecha = '';

     @FormField('Folios_Generacion_OCs', [''])
     Folios_Generacion_OCs: Folios_Generacion_OC[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

