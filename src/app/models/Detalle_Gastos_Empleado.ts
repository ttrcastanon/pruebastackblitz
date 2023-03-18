import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Concepto_de_Gasto_de_Empleado } from './Concepto_de_Gasto_de_Empleado';
import { Moneda } from './Moneda';
import { Forma_de_Pago } from './Forma_de_Pago';
import { Resultado_de_Autorizacion_de_Vuelo } from './Resultado_de_Autorizacion_de_Vuelo';


export class Detalle_Gastos_Empleado  extends BaseView {
    @FormField('Fecha_de_gasto', [''])
    Fecha_de_gasto = '';
    @FormField('Folio', [0])
    Folio = 0;
    Gastos_de_Vuelo = 0;
    @FormField('Concepto', [''])
    Concepto = null;
    Concepto_Concepto_de_Gasto_de_Empleado: Concepto_de_Gasto_de_Empleado;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Monto', [''])
    Monto = null;
    @FormField('Moneda', [''])
    Moneda = null;
    Moneda_Moneda: Moneda;
    @FormField('Forma_de_Pago', [''])
    Forma_de_Pago = null;
    Forma_de_Pago_Forma_de_Pago: Forma_de_Pago;
    @FormField('Comprobante', [''])
    Comprobante = null;
    @FormField('ComprobanteFile', [''])
    ComprobanteFile: FileInput = null;
    @FormField('Autorizacion', [''])
    Autorizacion = null;
    Autorizacion_Resultado_de_Autorizacion_de_Vuelo: Resultado_de_Autorizacion_de_Vuelo;
    @FormField('Observaciones', [''])
    Observaciones = '';

     @FormField('Detalle_Gastos_Empleados', [''])
     Detalle_Gastos_Empleados: Detalle_Gastos_Empleado[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
     Comprobante_Spartane_File: any;
}

