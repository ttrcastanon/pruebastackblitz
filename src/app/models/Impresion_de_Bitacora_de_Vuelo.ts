import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Registro_de_vuelo } from './Registro_de_vuelo';


export class Impresion_de_Bitacora_de_Vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Vuelo', [''])
    Vuelo = null;
    Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Tramo1', [''])
    Tramo1 = null;
    Tramo1_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Tramo2', [''])
    Tramo2 = null;
    Tramo2_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Tramo3', [''])
    Tramo3 = null;
    Tramo3_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Tramo4', [''])
    Tramo4 = null;
    Tramo4_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Tramo5', [''])
    Tramo5 = null;
    Tramo5_Registro_de_vuelo: Registro_de_vuelo;

     @FormField('Impresion_de_Bitacora_de_Vuelos', [''])
     Impresion_de_Bitacora_de_Vuelos: Impresion_de_Bitacora_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

