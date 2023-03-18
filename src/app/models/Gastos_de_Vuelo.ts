import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Ingreso_de_Gasto } from './Tipo_de_Ingreso_de_Gasto';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Registro_de_vuelo } from './Registro_de_vuelo';
import { Aeropuertos } from './Aeropuertos';
import { Spartan_User } from './Spartan_User';
import { Detalle_Anticipo_de_Viaticos } from './Detalle_Anticipo_de_Viaticos';
import { Estatus_de_Gastos_de_Vuelo } from './Estatus_de_Gastos_de_Vuelo';
import { Detalle_Gastos_Empleado } from './Detalle_Gastos_Empleado';
import { Detalle_Gastos_Aeronave } from './Detalle_Gastos_Aeronave';
import { Detalle_Gastos_Resumen } from './Detalle_Gastos_Resumen';


export class Gastos_de_Vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Tipo_de_Ingreso_de_Gasto', [''])
    Tipo_de_Ingreso_de_Gasto = null;
    Tipo_de_Ingreso_de_Gasto_Tipo_de_Ingreso_de_Gasto: Tipo_de_Ingreso_de_Gasto;
    @FormField('Orden_de_Trabajo', [''])
    Orden_de_Trabajo = null;
    Orden_de_Trabajo_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Tramo_de_Vuelo', [''])
    Tramo_de_Vuelo = null;
    Tramo_de_Vuelo_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Salida', [''])
    Salida = null;
    Salida_Aeropuertos: Aeropuertos;
    @FormField('Destino', [''])
    Destino = null;
    Destino_Aeropuertos: Aeropuertos;
    @FormField('Empleado', [''])
    Empleado = null;
    Empleado_Spartan_User: Spartan_User;
    @FormField('Detalle_Anticipo_de_ViaticosItems', [], Detalle_Anticipo_de_Viaticos,  true)
    Detalle_Anticipo_de_ViaticosItems: FormArray;

    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Gastos_de_Vuelo: Estatus_de_Gastos_de_Vuelo;
    @FormField('Detalle_Gastos_EmpleadoItems', [], Detalle_Gastos_Empleado,  true)
    Detalle_Gastos_EmpleadoItems: FormArray;

    @FormField('empleado_total_mxn', [''])
    empleado_total_mxn = null;
    @FormField('empleado_total_usd', [''])
    empleado_total_usd = null;
    @FormField('empleado_total_eur', [''])
    empleado_total_eur = null;
    @FormField('empleado_total_libras', [''])
    empleado_total_libras = null;
    @FormField('empleado_total_cad', [''])
    empleado_total_cad = null;
    @FormField('Detalle_Gastos_AeronaveItems', [], Detalle_Gastos_Aeronave,  true)
    Detalle_Gastos_AeronaveItems: FormArray;

    @FormField('aeronave_total_mxn', [''])
    aeronave_total_mxn = null;
    @FormField('aeronave_total_usd', [''])
    aeronave_total_usd = null;
    @FormField('aeronave_total_eur', [''])
    aeronave_total_eur = null;
    @FormField('aeronave_total_libras', [''])
    aeronave_total_libras = null;
    @FormField('aeronave_total_cad', [''])
    aeronave_total_cad = null;
    @FormField('Detalle_Gastos_ResumenItems', [], Detalle_Gastos_Resumen,  true)
    Detalle_Gastos_ResumenItems: FormArray;

    @FormField('Observaciones', [''])
    Observaciones = '';

     @FormField('Gastos_de_Vuelos', [''])
     Gastos_de_Vuelos: Gastos_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

