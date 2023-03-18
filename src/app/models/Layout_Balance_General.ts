import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Concepto_Balance_General } from './Tipo_de_Concepto_Balance_General';
import { Agrupacion_Concepto_Balance_General } from './Agrupacion_Concepto_Balance_General';
import { Concepto_Balance_General } from './Concepto_Balance_General';


export class Layout_Balance_General  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_de_carga_manual', [0])
    Folio_de_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('TipoConcepto', [''])
    TipoConcepto = null;
    TipoConcepto_Tipo_de_Concepto_Balance_General: Tipo_de_Concepto_Balance_General;
    @FormField('AgrupacionConcepto', [''])
    AgrupacionConcepto = null;
    AgrupacionConcepto_Agrupacion_Concepto_Balance_General: Agrupacion_Concepto_Balance_General;
    @FormField('Concepto', [''])
    Concepto = null;
    Concepto_Concepto_Balance_General: Concepto_Balance_General;
    @FormField('Real', [''])
    Real = null;
    @FormField('Presupuesto', [''])
    Presupuesto = null;

     @FormField('Layout_Balance_Generals', [''])
     Layout_Balance_Generals: Layout_Balance_General[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

