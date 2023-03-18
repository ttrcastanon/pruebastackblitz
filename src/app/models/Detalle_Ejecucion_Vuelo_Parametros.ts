import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Ejecucion_Vuelo_Parametros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Ejecucion_de_Vuelo = 0;
    @FormField('Parametro', [''])
    Parametro = '';
    @FormField('MOT_1', [''])
    MOT_1 = '';
    @FormField('MOT_2', [''])
    MOT_2 = '';

     @FormField('Detalle_Ejecucion_Vuelo_Parametross', [''])
     Detalle_Ejecucion_Vuelo_Parametross: Detalle_Ejecucion_Vuelo_Parametros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

