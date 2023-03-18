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


export class Pago_de_servicios_de_operaciones  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('IdLisPagServOp', [0])
    IdLisPagServOp = null;
    @FormField('No_de_Solicitud', [''])
    No_de_Solicitud = null;
    No_de_Solicitud_Solicitud_de_Servicios_para_Operaciones: Solicitud_de_Servicios_para_Operaciones;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No_Vuelo', [''])
    No_Vuelo = null;
    No_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
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
    @FormField('Costo', [''])
    Costo = null;
    @FormField('No_de_Factura', [0])
    No_de_Factura = null;
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Tiempos_de_Pago', [0])
    Tiempos_de_Pago = null;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('No_de_Referencia', [''])
    No_de_Referencia = '';
    @FormField('Fecha_de_Ejecucion_del_Pago', [''])
    Fecha_de_Ejecucion_del_Pago = '';

     @FormField('Pago_de_servicios_de_operacioness', [''])
     Pago_de_servicios_de_operacioness: Pago_de_servicios_de_operaciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

