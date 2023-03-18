import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_Concepto } from './Tipo_Concepto';
import { Tipo_de_Gasto } from './Tipo_de_Gasto';
import { Concepto } from './Concepto';


export class Layout_Gastos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_de_carga_manual', [0])
    Folio_de_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('TipoConcepto', [''])
    TipoConcepto = null;
    TipoConcepto_Tipo_Concepto: Tipo_Concepto;
    @FormField('TipoGasto', [''])
    TipoGasto = null;
    TipoGasto_Tipo_de_Gasto: Tipo_de_Gasto;
    @FormField('Concepto', [''])
    Concepto = null;
    Concepto_Concepto: Concepto;
    @FormField('Real', [''])
    Real = null;
    @FormField('Presupuesto', [''])
    Presupuesto = null;

     @FormField('Layout_Gastoss', [''])
     Layout_Gastoss: Layout_Gastos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

