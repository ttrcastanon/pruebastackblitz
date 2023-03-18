import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Destino } from './Tipo_de_Destino';
import { Moneda } from './Moneda';


export class Detalle_Configuracion_de_Politicas_de_Viaticos  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    ID_Configuracion = 0;
    @FormField('Tipo_de_Destino', [''])
    Tipo_de_Destino = null;
    Tipo_de_Destino_Tipo_de_Destino: Tipo_de_Destino;
    @FormField('Monto_Diario_Autorizado', [''])
    Monto_Diario_Autorizado = null;
    @FormField('Tipo_de_Moneda', [''])
    Tipo_de_Moneda = null;
    Tipo_de_Moneda_Moneda: Moneda;

     @FormField('Detalle_Configuracion_de_Politicas_de_Viaticoss', [''])
     Detalle_Configuracion_de_Politicas_de_Viaticoss: Detalle_Configuracion_de_Politicas_de_Viaticos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

