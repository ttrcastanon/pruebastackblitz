import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Medio_de_Comunicacion } from './Tipo_de_Medio_de_Comunicacion';
import { Medio_de_Comunicacion } from './Medio_de_Comunicacion';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Pasajeros = 0;
    @FormField('Tipo_de_Medio', [''])
    Tipo_de_Medio = null;
    Tipo_de_Medio_Tipo_de_Medio_de_Comunicacion: Tipo_de_Medio_de_Comunicacion;
    @FormField('Medio', [''])
    Medio = null;
    Medio_Medio_de_Comunicacion: Medio_de_Comunicacion;
    @FormField('Otro', [''])
    Otro = '';
    @FormField('SC', [''])
    SC = '';
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistass', [''])
     Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistass: Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

