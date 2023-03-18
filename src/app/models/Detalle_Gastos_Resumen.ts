import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Gastos_Resumen  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Gastos_de_Vuelo = 0;
    @FormField('Concepto', [''])
    Concepto = '';
    @FormField('MXN', [''])
    MXN = null;
    @FormField('USD', [''])
    USD = null;
    @FormField('EUR', [''])
    EUR = null;
    @FormField('LIBRA', [''])
    LIBRA = null;
    @FormField('CAD', [''])
    CAD = null;

     @FormField('Detalle_Gastos_Resumens', [''])
     Detalle_Gastos_Resumens: Detalle_Gastos_Resumen[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

