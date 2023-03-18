import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Posicion_de_Piezas } from './Tipo_de_Posicion_de_Piezas';


export class Piezas  extends BaseView {
    @FormField('Codigo', [''])
    Codigo = '';
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Instalacion', [''])
    Instalacion = '';
    @FormField('N_de_Serie', [''])
    N_de_Serie = '';
    @FormField('Posicion', [''])
    Posicion = null;
    Posicion_Tipo_de_Posicion_de_Piezas: Tipo_de_Posicion_de_Piezas;
    @FormField('OT', [0])
    OT = null;
    @FormField('Periodicidad_meses', [0])
    Periodicidad_meses = null;
    @FormField('Vencimiento', [''])
    Vencimiento = '';
    @FormField('Descripcion_Busqueda', [''])
    Descripcion_Busqueda = '';

     @FormField('Piezass', [''])
     Piezass: Piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

