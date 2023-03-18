import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Moneda } from './Moneda';


export class Detalle_Gastos_Anticipo_Viaticos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Gastos_de_Vuelo = 0;
    @FormField('Anticipo_de_Viaticos', [''])
    Anticipo_de_Viaticos = null;
    @FormField('Moneda', [''])
    Moneda = null;
    Moneda_Moneda: Moneda;

     @FormField('Detalle_Gastos_Anticipo_Viaticoss', [''])
     Detalle_Gastos_Anticipo_Viaticoss: Detalle_Gastos_Anticipo_Viaticos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

