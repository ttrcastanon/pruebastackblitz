import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';


export class Tecnico_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Clave_tecnico = 0;
    @FormField('Aeronave', [''])
    Aeronave = null;
    Aeronave_Aeronave: Aeronave;

     @FormField('Tecnico_Aeronaves', [''])
     Tecnico_Aeronaves: Tecnico_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

