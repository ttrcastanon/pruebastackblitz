import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Estatus_de_Reporte } from './Estatus_de_Reporte';
import { Spartan_User } from './Spartan_User';


export class Productividad_del_area_de_mantenimiento  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Fecha_de_vencimiento', [''])
    Fecha_de_vencimiento = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Reporte: Estatus_de_Reporte;
    @FormField('N_Reporte', [''])
    N_Reporte = '';
    @FormField('Asignado_a', [''])
    Asignado_a = null;
    Asignado_a_Spartan_User: Spartan_User;
    @FormField('Tiempo_estimado_de_ejecucion', [''])
    Tiempo_estimado_de_ejecucion = '';
    @FormField('Tiempo_real_de_ejecucion', [''])
    Tiempo_real_de_ejecucion = '';
    @FormField('Asignar_ejecutante', [''])
    Asignar_ejecutante = null;
    Asignar_ejecutante_Spartan_User: Spartan_User;

     @FormField('Productividad_del_area_de_mantenimientos', [''])
     Productividad_del_area_de_mantenimientos: Productividad_del_area_de_mantenimiento[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

