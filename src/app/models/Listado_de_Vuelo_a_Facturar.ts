import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Tipo_de_vuelo } from './Tipo_de_vuelo';
import { Pasajeros } from './Pasajeros';


export class Listado_de_Vuelo_a_Facturar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Vuelo', [''])
    Vuelo = null;
    Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Tipo', [''])
    Tipo = null;
    Tipo_Tipo_de_vuelo: Tipo_de_vuelo;
    @FormField('Pasajeros', [''])
    Pasajeros = null;
    Pasajeros_Pasajeros: Pasajeros;

     @FormField('Listado_de_Vuelo_a_Facturars', [''])
     Listado_de_Vuelo_a_Facturars: Listado_de_Vuelo_a_Facturar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

