import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Spartan_User } from './Spartan_User';
import { Estatus_de_Orden_de_Trabajo } from './Estatus_de_Orden_de_Trabajo';


export class Detalle_de_Listado_de_Ordenes_de_Trabajo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    idlistado_de_orden_de_trabajo = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('N_de_OT', [''])
    N_de_OT = '';
    @FormField('N_Reporte', [''])
    N_Reporte = '';
    @FormField('Asignado_a', [''])
    Asignado_a = null;
    Asignado_a_Spartan_User: Spartan_User;
    @FormField('Tiempo_estimado_de_ejecucion', [0])
    Tiempo_estimado_de_ejecucion = null;
    @FormField('Tiempo_real_de_ejecucion', [0])
    Tiempo_real_de_ejecucion = null;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Orden_de_Trabajo: Estatus_de_Orden_de_Trabajo;
    @FormField('Expediente_OT', [''])
    Expediente_OT = '';
    @FormField('Sticker_de_bitacora', [''])
    Sticker_de_bitacora = null;
    @FormField('Sticker_de_bitacoraFile', [''])
    Sticker_de_bitacoraFile: FileInput = null;

     @FormField('Detalle_de_Listado_de_Ordenes_de_Trabajos', [''])
     Detalle_de_Listado_de_Ordenes_de_Trabajos: Detalle_de_Listado_de_Ordenes_de_Trabajo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

