import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Aeronave } from './Aeronave';
import { Moneda } from './Moneda';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';
import { Ingreso_de_Costos } from './Ingreso_de_Costos';


export class Detalle_de_Listado_de_Pago_de_Proveedores extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Listado_de_Pago_de_Proveedores = 0;
    @FormField('Partida', [''])
    Partida = '';
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('No__de_Factura', [''])
    No__de_Factura = '';
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Total_de_Factura_', ['0.00'])
    Total_de_Factura_ = '0.00';
    @FormField('Moneda', [''])
    Moneda = 1;
    Moneda_Moneda: Moneda;
    @FormField('No__de_OC', [''])
    No__de_OC = null;
    No__de_OC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Fecha_de_Pago', [''])
    Fecha_de_Pago = '';
    @FormField('Fecha_Requerida', [''])
    Fecha_Requerida = '';
    @FormField('Tiempos_de_Pago', [0])
    Tiempos_de_Pago = null;
    @FormField('Nota_de_Credito', [''])
    Nota_de_Credito = '';
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('Solicitud_de_Pago', [false])
    Solicitud_de_Pago = false;
    @FormField('IdSolicitudPago', [''])
    IdSolicitudPago = null;
    IdSolicitudPago_Ingreso_de_Costos: Ingreso_de_Costos;
    @FormField('EsPrincipal', [false])
    EsPrincipal = false;

    @FormField('Detalle_de_Listado_de_Pago_de_Proveedoress', [''])
    Detalle_de_Listado_de_Pago_de_Proveedoress: Detalle_de_Listado_de_Pago_de_Proveedores[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

