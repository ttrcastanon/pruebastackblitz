import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_Concepto_Estado_Resultado } from './Tipo_Concepto_Estado_Resultado';
import { Concepto_Estado_de_Resultado } from './Concepto_Estado_de_Resultado';


export class Layout_Estado_de_Resultado  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_de_carga_manual', [0])
    Folio_de_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('TipoConcepto', [''])
    TipoConcepto = null;
    TipoConcepto_Tipo_Concepto_Estado_Resultado: Tipo_Concepto_Estado_Resultado;
    @FormField('Concepto', [''])
    Concepto = null;
    Concepto_Concepto_Estado_de_Resultado: Concepto_Estado_de_Resultado;
    @FormField('Real', [''])
    Real = null;
    @FormField('Presupuesto', [''])
    Presupuesto = null;

     @FormField('Layout_Estado_de_Resultados', [''])
     Layout_Estado_de_Resultados: Layout_Estado_de_Resultado[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

