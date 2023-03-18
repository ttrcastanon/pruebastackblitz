import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';


export class Ingreso_de_Costos extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__de_OC', [''])
    No__de_OC = null;
    No__de_OC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No__de_Factura', [''])
    No__de_Factura = '';
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Fecha_de_Pago', [''])
    Fecha_de_Pago = '';
    @FormField('Nota_de_Credito', [''])
    Nota_de_Credito = '';
    @FormField('Total_de_Factura_', ['0.00'])
    Total_de_Factura_ = '0.00';
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('IdSolicitudPago', [''])
    IdSolicitudPago = '';

    @FormField('Ingreso_de_Costoss', [''])
    Ingreso_de_Costoss: Ingreso_de_Costos[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

