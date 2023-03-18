import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cliente } from './Cliente';


export class Presupuesto_Anual extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Empresa', [''])
    Empresa = null;
    Empresa_Cliente: Cliente;
    @FormField('Ano_en_curso', [''])
    Ano_en_curso = null;
    @FormField('Monto_Pres__Inicial_Ano', [0])
    Monto_Pres__Inicial_Ano = null;
    @FormField('Porcentaje_Pres__Ano', [0])
    Porcentaje_Pres__Ano = null;
    @FormField('Gasto_Real_Facturado', [0])
    Gasto_Real_Facturado = null;
    @FormField('Pto__Estimado_acumulado', [0])
    Pto__Estimado_acumulado = null;
    @FormField('Porcentaje_Estimado_Acumulado', [0])
    Porcentaje_Estimado_Acumulado = null;
    @FormField('Porcentaje_Gasto_Real_Acumulado', [0])
    Porcentaje_Gasto_Real_Acumulado = null;
    @FormField('Porcentaje_Diferencia', [0])
    Porcentaje_Diferencia = null;

    @FormField('Presupuesto_Anuals', [''])
    Presupuesto_Anuals: Presupuesto_Anual[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

