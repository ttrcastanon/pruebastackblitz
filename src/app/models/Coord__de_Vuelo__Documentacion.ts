import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Detalle_Coord_Documentacion_Aeronave } from './Detalle_Coord_Documentacion_Aeronave';
import { Detalle_Coord_Documentacion_PAXs } from './Detalle_Coord_Documentacion_PAXs';


export class Coord__de_Vuelo__Documentacion  extends BaseView {
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
    @FormField('Detalle_Coord_Documentacion_AeronaveItems', [], Detalle_Coord_Documentacion_Aeronave,  true)
    Detalle_Coord_Documentacion_AeronaveItems: FormArray;

    @FormField('Detalle_Coord_Documentacion_PAXsItems', [], Detalle_Coord_Documentacion_PAXs,  true)
    Detalle_Coord_Documentacion_PAXsItems: FormArray;


     @FormField('Coord__de_Vuelo__Documentacions', [''])
     Coord__de_Vuelo__Documentacions: Coord__de_Vuelo__Documentacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

