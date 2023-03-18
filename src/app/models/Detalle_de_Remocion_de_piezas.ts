import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Detalle_Parte_Asociada_al_Componente_Aeronave } from './Detalle_Parte_Asociada_al_Componente_Aeronave';
import { Estatus_de_remocion } from './Estatus_de_remocion';
import { Spartan_User } from './Spartan_User';
import { Causa_de_remocion } from './Causa_de_remocion';
import { Tiempo_de_remocion } from './Tiempo_de_remocion';


export class Detalle_de_Remocion_de_piezas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdRemocion = 0;
    @FormField('N_de_Parte', [''])
    N_de_Parte = null;
    N_de_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave: Detalle_Parte_Asociada_al_Componente_Aeronave;
    @FormField('N_de_Serie', [''])
    N_de_Serie = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_remocion: Estatus_de_remocion;
    @FormField('Horas_Actuales', [0])
    Horas_Actuales = null;
    @FormField('Ciclos_Actuales', [0])
    Ciclos_Actuales = null;
    @FormField('Fecha_de_Remocion', [''])
    Fecha_de_Remocion = '';
    @FormField('Encargado_de_la_remocion', [''])
    Encargado_de_la_remocion = null;
    Encargado_de_la_remocion_Spartan_User: Spartan_User;
    @FormField('Causa_de_remocion', [''])
    Causa_de_remocion = null;
    Causa_de_remocion_Causa_de_remocion: Causa_de_remocion;
    @FormField('Tiempo_de_remocion', [''])
    Tiempo_de_remocion = null;
    Tiempo_de_remocion_Tiempo_de_remocion: Tiempo_de_remocion;

     @FormField('Detalle_de_Remocion_de_piezass', [''])
     Detalle_de_Remocion_de_piezass: Detalle_de_Remocion_de_piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

