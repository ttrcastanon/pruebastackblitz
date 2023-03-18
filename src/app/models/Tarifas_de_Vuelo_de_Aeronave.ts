import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Moneda } from './Moneda';


export class Tarifas_de_Vuelo_de_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Tarifa_Normal', [''])
    Tarifa_Normal = null;
    @FormField('Tarifa_Reducida', [''])
    Tarifa_Reducida = null;
    @FormField('Tarifa_en_Espera', [''])
    Tarifa_en_Espera = null;
    @FormField('Percnota', [''])
    Percnota = null;
    @FormField('Moneda', [''])
    Moneda = null;
    Moneda_Moneda: Moneda;
    @FormField('Ultima_Modificacion', [''])
    Ultima_Modificacion = '';
    @FormField('Hora_de_ultima_modificacion', [''])
    Hora_de_ultima_modificacion = '';

     @FormField('Tarifas_de_Vuelo_de_Aeronaves', [''])
     Tarifas_de_Vuelo_de_Aeronaves: Tarifas_de_Vuelo_de_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

