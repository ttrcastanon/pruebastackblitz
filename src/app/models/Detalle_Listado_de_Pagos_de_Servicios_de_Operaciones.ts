import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Servicios_para_Operaciones } from './Solicitud_de_Servicios_para_Operaciones';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeropuertos } from './Aeropuertos';
import { Unidad } from './Unidad';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';
import { Ingreso_de_Costos_de_Servicios } from './Ingreso_de_Costos_de_Servicios';


export class Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Solicitud_de_PagosServiciosOperaciones = 0;
    @FormField('No__de_Solicitud', [''])
    No__de_Solicitud = null;
    No__de_Solicitud_Solicitud_de_Servicios_para_Operaciones: Solicitud_de_Servicios_para_Operaciones;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No__Vuelo', [''])
    No__Vuelo = null;
    No__Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Aeropuerto', [''])
    Aeropuerto = null;
    Aeropuerto_Aeropuertos: Aeropuertos;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;
    @FormField('Costo_', [''])
    Costo_ = null;
    @FormField('No__de_Factura', [0])
    No__de_Factura = null;
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Tiempos_de_Pago', [0])
    Tiempos_de_Pago = null;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('FolioIngresoCostosServicios', [''])
    FolioIngresoCostosServicios = null;
    FolioIngresoCostosServicios_Ingreso_de_Costos_de_Servicios: Ingreso_de_Costos_de_Servicios;
    @FormField('Solicitud_de_Pago', [''])
    Solicitud_de_Pago = '';

     @FormField('Detalle_Listado_de_Pagos_de_Servicios_de_Operacioness', [''])
     Detalle_Listado_de_Pagos_de_Servicios_de_Operacioness: Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

