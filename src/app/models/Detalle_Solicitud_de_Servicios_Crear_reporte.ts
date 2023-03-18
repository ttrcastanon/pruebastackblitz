import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Catalogo_servicios } from './Catalogo_servicios';
import { Unidad } from './Unidad';
import { Urgencia } from './Urgencia';
import { Existencia_solicitud_crear_reporte } from './Existencia_solicitud_crear_reporte';


export class Detalle_Solicitud_de_Servicios_Crear_reporte  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Crear_reporte = 0;
    @FormField('N_Servicio_Descripcion', [''])
    N_Servicio_Descripcion = null;
    N_Servicio_Descripcion_Catalogo_servicios: Catalogo_servicios;
    @FormField('Fecha_Estimada_del_Mtto', [''])
    Fecha_Estimada_del_Mtto = '';
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

     @FormField('Detalle_Solicitud_de_Servicios_Crear_reportes', [''])
     Detalle_Solicitud_de_Servicios_Crear_reportes: Detalle_Solicitud_de_Servicios_Crear_reporte[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

