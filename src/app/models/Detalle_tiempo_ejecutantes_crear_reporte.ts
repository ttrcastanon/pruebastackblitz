import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';


export class Detalle_tiempo_ejecutantes_crear_reporte  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdCrear_reporte = 0;
    @FormField('Ejecutante', [''])
    Ejecutante = null;
    Ejecutante_Spartan_User: Spartan_User;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Hora_inicial', [''])
    Hora_inicial = '';
    @FormField('Hora_final', [''])
    Hora_final = '';
    @FormField('Tiempo_ejecucion_en_hrs', [''])
    Tiempo_ejecucion_en_hrs = null;
    @FormField('Motivo_de_pausa', [''])
    Motivo_de_pausa = '';

     @FormField('Detalle_tiempo_ejecutantes_crear_reportes', [''])
     Detalle_tiempo_ejecutantes_crear_reportes: Detalle_tiempo_ejecutantes_crear_reporte[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

