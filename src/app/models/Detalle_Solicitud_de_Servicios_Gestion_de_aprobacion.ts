import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Catalogo_servicios } from './Catalogo_servicios';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Unidad } from './Unidad';
import { Urgencia } from './Urgencia';
import { Crear_Reporte } from './Crear_Reporte';
import { Existencia_solicitud_crear_reporte } from './Existencia_solicitud_crear_reporte';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';


export class Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Gestion_de_aprobacion_de_mantenimiento = 0;
    @FormField('N_Servicio_Descripcion', [''])
    N_Servicio_Descripcion = null;
    N_Servicio_Descripcion_Catalogo_servicios: Catalogo_servicios;
    @FormField('N_de_OT', [''])
    N_de_OT = null;
    N_de_OT_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Fecha_Estimada_del_Mtto_', [''])
    Fecha_Estimada_del_Mtto_ = '';
    @FormField('Cantidad', [''])
    Cantidad = '';
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;
    @FormField('Urgencia', [''])
    Urgencia = null;
    Urgencia_Urgencia: Urgencia;
    @FormField('N_Reporte', [''])
    N_Reporte = null;
    N_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Razon_de_Solicitud', [''])
    Razon_de_Solicitud = '';
    @FormField('Existencia_Almacen', [''])
    Existencia_Almacen = null;
    Existencia_Almacen_Existencia_solicitud_crear_reporte: Existencia_solicitud_crear_reporte;
    @FormField('Aprobacion_de_mantenimiento', [''])
    Aprobacion_de_mantenimiento = null;
    Aprobacion_de_mantenimiento_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('FolioDetalleSolicitudServicios', [''])
    FolioDetalleSolicitudServicios = '';

     @FormField('Detalle_Solicitud_de_Servicios_Gestion_de_aprobacions', [''])
     Detalle_Solicitud_de_Servicios_Gestion_de_aprobacions: Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

