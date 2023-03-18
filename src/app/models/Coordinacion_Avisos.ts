import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Detalle_Coordinacion_Avisos } from './Detalle_Coordinacion_Avisos';


export class Coordinacion_Avisos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Ruta_de_Vuelo', [''])
    Ruta_de_Vuelo = '';
    @FormField('Fecha_y_Hora_de_Salida', [''])
    Fecha_y_Hora_de_Salida = '';
    @FormField('Calificacion', [0])
    Calificacion = null;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Detalle_Coordinacion_AvisosItems', [], Detalle_Coordinacion_Avisos,  true)
    Detalle_Coordinacion_AvisosItems: FormArray;


     @FormField('Coordinacion_Avisoss', [''])
     Coordinacion_Avisoss: Coordinacion_Avisos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

