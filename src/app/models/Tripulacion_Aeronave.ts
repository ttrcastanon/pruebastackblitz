import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';


export class Tripulacion_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Clave_Tripulacion = 0;
    @FormField('Aeronave', [''])
    Aeronave = null;
    Aeronave_Aeronave: Aeronave;

     @FormField('Tripulacion_Aeronaves', [''])
     Tripulacion_Aeronaves: Tripulacion_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

