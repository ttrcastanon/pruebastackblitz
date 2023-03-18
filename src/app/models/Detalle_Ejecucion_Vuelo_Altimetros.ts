import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Ejecucion_Vuelo_Altimetros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Ejecucion_de_Vuelo = 0;
    @FormField('Concepto', [''])
    Concepto = '';
    @FormField('ALTIM_1', [''])
    ALTIM_1 = '';
    @FormField('ALTIM_2', [''])
    ALTIM_2 = '';
    @FormField('ALTIM_AUX', [''])
    ALTIM_AUX = '';

     @FormField('Detalle_Ejecucion_Vuelo_Altimetross', [''])
     Detalle_Ejecucion_Vuelo_Altimetross: Detalle_Ejecucion_Vuelo_Altimetros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

