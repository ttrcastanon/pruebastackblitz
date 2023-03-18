import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Codigo_Computarizado } from './Codigo_Computarizado';


export class Detalle_Codigos_Computarizados_Cotizacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Cotizacion = 0;
    @FormField('No', [0])
    No = null;
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = null;
    Codigo_Computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Monto_Partes', [''])
    Monto_Partes = null;
    @FormField('Monto_Servicios', [''])
    Monto_Servicios = null;
    @FormField('Tiempo_Hr_Tecnico', [0])
    Tiempo_Hr_Tecnico = null;
    @FormField('Tiempo_Hr_Rampa', [0])
    Tiempo_Hr_Rampa = null;
    @FormField('Monto_Mtto', [''])
    Monto_Mtto = null;

     @FormField('Detalle_Codigos_Computarizados_Cotizacions', [''])
     Detalle_Codigos_Computarizados_Cotizacions: Detalle_Codigos_Computarizados_Cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

