import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_remocion } from './Estatus_de_remocion';
import { Causa_de_remocion } from './Causa_de_remocion';
import { Spartan_User } from './Spartan_User';
import { Tiempo_de_remocion } from './Tiempo_de_remocion';


export class Historial_de_Remocion_de_partes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('N_de_parte', [''])
    N_de_parte = '';
    @FormField('N_Serie', [''])
    N_Serie = '';
    @FormField('Modelo', [''])
    Modelo = '';
    @FormField('Posicion', [''])
    Posicion = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_remocion: Estatus_de_remocion;
    @FormField('Horas_actuales', [0])
    Horas_actuales = null;
    @FormField('Ciclos_actuales', [0])
    Ciclos_actuales = null;
    @FormField('Causa_de_remocion', [''])
    Causa_de_remocion = null;
    Causa_de_remocion_Causa_de_remocion: Causa_de_remocion;
    @FormField('Fecha_de_Remocion', [''])
    Fecha_de_Remocion = '';
    @FormField('Usuario_que_realiza_la_remocion', [''])
    Usuario_que_realiza_la_remocion = null;
    Usuario_que_realiza_la_remocion_Spartan_User: Spartan_User;
    @FormField('Tiempo_de_remocion', [''])
    Tiempo_de_remocion = null;
    Tiempo_de_remocion_Tiempo_de_remocion: Tiempo_de_remocion;
    IdControl = 0;

     @FormField('Historial_de_Remocion_de_partess', [''])
     Historial_de_Remocion_de_partess: Historial_de_Remocion_de_partes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

