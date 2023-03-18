import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Tramite } from './Solicitud_de_Tramite';
import { Tipo_de_Cotizacion } from './Tipo_de_Cotizacion';
import { Tipo_de_Plan_de_Seguro_de_Vida } from './Tipo_de_Plan_de_Seguro_de_Vida';
import { Genero } from './Genero';
import { Parentesco } from './Parentesco';
import { Respuesta } from './Respuesta';


export class Vida_Cotizacion  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Solicitud_de_Tramite', [''])
    Solicitud_de_Tramite = null;
    Solicitud_de_Tramite_Solicitud_de_Tramite: Solicitud_de_Tramite;
    @FormField('Cotizacion_solicitada', [''])
    Cotizacion_solicitada = null;
    Cotizacion_solicitada_Tipo_de_Cotizacion: Tipo_de_Cotizacion;
    @FormField('Plan_Solicitado', [''])
    Plan_Solicitado = null;
    Plan_Solicitado_Tipo_de_Plan_de_Seguro_de_Vida: Tipo_de_Plan_de_Seguro_de_Vida;
    @FormField('Nombre', ['', Validators.required])
    Nombre = '';
    @FormField('Apellido_paterno', ['', Validators.required])
    Apellido_paterno = '';
    @FormField('Apellido_materno', ['', Validators.required])
    Apellido_materno = '';
    @FormField('Fecha_de_nacimiento', ['', Validators.required])
    Fecha_de_nacimiento = '';
    @FormField('Genero', [''])
    Genero = null;
    Genero_Genero: Genero;
    @FormField('Parentesco', [''])
    Parentesco = null;
    Parentesco_Parentesco: Parentesco;
    @FormField('Monto_de_la_cotizacion', ['', Validators.required])
    Monto_de_la_cotizacion = null;
    @FormField('Autorizacion_de_cotizacion', [''])
    Autorizacion_de_cotizacion = null;
    Autorizacion_de_cotizacion_Respuesta: Respuesta;

     @FormField('Vida_Cotizacions', [''])
     Vida_Cotizacions: Vida_Cotizacion[] = [];
        
}

