import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cotizacion } from './Cotizacion';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Tipo_de_Reporte } from './Tipo_de_Reporte';
import { Codigo_Computarizado } from './Codigo_Computarizado';
import { Detalle_Partes_CMP_Cotizar } from './Detalle_Partes_CMP_Cotizar';
import { Detalle_Servicios_Externos_CMP_Cotizar } from './Detalle_Servicios_Externos_CMP_Cotizar';
import { Estatus_de_CMP_a_Cotizar } from './Estatus_de_CMP_a_Cotizar';


export class CMP_a_Cotizar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Cotizacion', [''])
    Cotizacion = null;
    Cotizacion_Cotizacion: Cotizacion;
    @FormField('Orden_de_Trabajo', [''])
    Orden_de_Trabajo = null;
    Orden_de_Trabajo_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Tipo_de_Reporte', [''])
    Tipo_de_Reporte = null;
    Tipo_de_Reporte_Tipo_de_Reporte: Tipo_de_Reporte;
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = null;
    Codigo_Computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Tiempo_Estandar_de_Ejecucion', [''])
    Tiempo_Estandar_de_Ejecucion = '';
    @FormField('tiempo_a_cobrar', [''])
    tiempo_a_cobrar = null;
    @FormField('Tiempo_a_Cobrar_Rampa', [''])
    Tiempo_a_Cobrar_Rampa = null;
    @FormField('Costo_HR_Tecnico', [''])
    Costo_HR_Tecnico = null;
    @FormField('Costo_HR_Rampa', [''])
    Costo_HR_Rampa = null;
    @FormField('Motivo_de_Cambio_de_Tarifa', [''])
    Motivo_de_Cambio_de_Tarifa = '';
    @FormField('Detalle_Partes_CMP_CotizarItems', [], Detalle_Partes_CMP_Cotizar,  true)
    Detalle_Partes_CMP_CotizarItems: FormArray;

    @FormField('Detalle_Servicios_Externos_CMP_CotizarItems', [], Detalle_Servicios_Externos_CMP_Cotizar,  true)
    Detalle_Servicios_Externos_CMP_CotizarItems: FormArray;

    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_CMP_a_Cotizar: Estatus_de_CMP_a_Cotizar;

     @FormField('CMP_a_Cotizars', [''])
     CMP_a_Cotizars: CMP_a_Cotizar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

