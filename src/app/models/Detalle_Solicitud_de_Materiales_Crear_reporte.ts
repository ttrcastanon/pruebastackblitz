﻿import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Listado_de_Materiales } from './Listado_de_Materiales';
import { Unidad } from './Unidad';
import { Urgencia } from './Urgencia';
import { Existencia_solicitud_crear_reporte } from './Existencia_solicitud_crear_reporte';


export class Detalle_Solicitud_de_Materiales_Crear_reporte  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Crear_reporte = 0;
    @FormField('Codigo_Descripcion', [''])
    Codigo_Descripcion = null;
    Codigo_Descripcion_Listado_de_Materiales: Listado_de_Materiales;
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
    @FormField('En_Existencia', [''])
    En_Existencia = null;
    En_Existencia_Existencia_solicitud_crear_reporte: Existencia_solicitud_crear_reporte;

     @FormField('Detalle_Solicitud_de_Materiales_Crear_reportes', [''])
     Detalle_Solicitud_de_Materiales_Crear_reportes: Detalle_Solicitud_de_Materiales_Crear_reporte[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

