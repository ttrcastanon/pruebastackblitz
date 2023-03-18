import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Partes } from './Partes';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Unidad } from './Unidad';
import { Urgencia } from './Urgencia';
import { Crear_Reporte } from './Crear_Reporte';
import { Existencia_solicitud_crear_reporte } from './Existencia_solicitud_crear_reporte';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';


export class Detalle_Solicitud_de_Piezas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Gestion_de_aprobacion_de_mantenimiento = 0;
    @FormField('N_Parte_Descripcion', [''])
    N_Parte_Descripcion = null;
    N_Parte_Descripcion_Partes: Partes;
    @FormField('N_de_OT', [''])
    N_de_OT = null;
    N_de_OT_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Horas_del_Componente_a_Remover', [''])
    Horas_del_Componente_a_Remover = '';
    @FormField('Ciclos_del_componente_a_Remover', [''])
    Ciclos_del_componente_a_Remover = '';
    @FormField('Cantidad', [''])
    Cantidad = '';
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;
    @FormField('Urgencia', [''])
    Urgencia = null;
    Urgencia_Urgencia: Urgencia;
    @FormField('Razon_de_Solicitud', [''])
    Razon_de_Solicitud = '';
    @FormField('Condicion_de_la_Parte', [''])
    Condicion_de_la_Parte = '';
    @FormField('N_Reporte', [''])
    N_Reporte = null;
    N_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('FolioDetalleSolicitudPartes', [''])
    FolioDetalleSolicitudPartes = '';
    @FormField('Existencia_Almacen', [''])
    Existencia_Almacen = null;
    Existencia_Almacen_Existencia_solicitud_crear_reporte: Existencia_solicitud_crear_reporte;
    @FormField('Aprobacion_de_mantenimiento', [''])
    Aprobacion_de_mantenimiento = null;
    Aprobacion_de_mantenimiento_Estatus_de_Seguimiento: Estatus_de_Seguimiento;

     @FormField('Detalle_Solicitud_de_Piezass', [''])
     Detalle_Solicitud_de_Piezass: Detalle_Solicitud_de_Piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

