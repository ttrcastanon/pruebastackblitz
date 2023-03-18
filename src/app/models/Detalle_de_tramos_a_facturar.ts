import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeropuertos } from './Aeropuertos';
import { Registro_de_vuelo } from './Registro_de_vuelo';


export class Detalle_de_tramos_a_facturar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    ID_facturacion_de_vuelo = 0;
    @FormField('Origen', [''])
    Origen = null;
    Origen_Aeropuertos: Aeropuertos;
    @FormField('Destino', [''])
    Destino = null;
    Destino_Aeropuertos: Aeropuertos;
    @FormField('Pasajeros', [''])
    Pasajeros = '';
    @FormField('Salida', [''])
    Salida = '';
    @FormField('Llegada', [''])
    Llegada = '';
    @FormField('Vuelo', [''])
    Vuelo = '';
    @FormField('Calzo', [''])
    Calzo = '';
    @FormField('Espera', [''])
    Espera = '';
    @FormField('Espera_real', [''])
    Espera_real = '';
    @FormField('Pernocta', [0])
    Pernocta = null;
    @FormField('Tramo', [''])
    Tramo = null;
    Tramo_Registro_de_vuelo: Registro_de_vuelo;

     @FormField('Detalle_de_tramos_a_facturars', [''])
     Detalle_de_tramos_a_facturars: Detalle_de_tramos_a_facturar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

