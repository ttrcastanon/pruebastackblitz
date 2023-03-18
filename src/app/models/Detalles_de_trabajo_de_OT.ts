import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Crear_Reporte } from './Crear_Reporte';
import { Spartan_User } from './Spartan_User';
import { Estatus_de_Reporte } from './Estatus_de_Reporte';


export class Detalles_de_trabajo_de_OT  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Id_Orden_de_Trabajo = 0;
    @FormField('Tipo_de_Reporte', [''])
    Tipo_de_Reporte = '';
    @FormField('Folio_de_Reporte', [''])
    Folio_de_Reporte = null;
    Folio_de_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Descripcion_de_Reporte', [''])
    Descripcion_de_Reporte = '';
    @FormField('Matricula', [''])
    Matricula = '';
    @FormField('Modelo', [''])
    Modelo = '';
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = '';
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = '';
    @FormField('Origen_del_Reporte', [''])
    Origen_del_Reporte = '';
    @FormField('Respuesta_Total', [''])
    Respuesta_Total = '';
    @FormField('Asignado_a', [''])
    Asignado_a = null;
    Asignado_a_Spartan_User: Spartan_User;
    @FormField('Asignado_a_1', [''])
    Asignado_a_1 = null;
    Asignado_a_1_Spartan_User: Spartan_User;
    @FormField('Asignado_a_2', [''])
    Asignado_a_2 = null;
    Asignado_a_2_Spartan_User: Spartan_User;
    @FormField('Asignado_a_3', [''])
    Asignado_a_3 = null;
    Asignado_a_3_Spartan_User: Spartan_User;
    @FormField('Asignado_a_4', [''])
    Asignado_a_4 = null;
    Asignado_a_4_Spartan_User: Spartan_User;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Reporte: Estatus_de_Reporte;
    @FormField('Notificado', [false])
    Notificado = false;

     @FormField('Detalles_de_trabajo_de_OTs', [''])
     Detalles_de_trabajo_de_OTs: Detalles_de_trabajo_de_OT[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

