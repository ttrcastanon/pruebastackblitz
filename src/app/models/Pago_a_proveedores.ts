import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';


export class Pago_a_proveedores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('IdLisPagPro', [0])
    IdLisPagPro = null;
    @FormField('No_de_OC', [''])
    No_de_OC = null;
    No_de_OC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No_de_Factura', [''])
    No_de_Factura = '';
    @FormField('Nota_de_Credito', [''])
    Nota_de_Credito = '';
    @FormField('Total_de_Factura', [''])
    Total_de_Factura = null;
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Tiempos_de_Pago', [0])
    Tiempos_de_Pago = null;
    @FormField('Fecha_de_Pago', [''])
    Fecha_de_Pago = '';
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('No_de_Referencia', [''])
    No_de_Referencia = '';
    @FormField('Fecha_de_Ejecucion_del_Pago', [''])
    Fecha_de_Ejecucion_del_Pago = '';

     @FormField('Pago_a_proveedoress', [''])
     Pago_a_proveedoress: Pago_a_proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

