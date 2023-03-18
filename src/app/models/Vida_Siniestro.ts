import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Tramite } from './Solicitud_de_Tramite';
import { Empleado } from './Empleado';
import { Beneficiarios_de_Empleado } from './Beneficiarios_de_Empleado';
import { Tipo_de_Siniestro } from './Tipo_de_Siniestro';
import { Respuesta } from './Respuesta';


export class Vida_Siniestro  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Solicitud_de_Tramite', [''])
    Solicitud_de_Tramite = null;
    Solicitud_de_Tramite_Solicitud_de_Tramite: Solicitud_de_Tramite;
    @FormField('Empleado', [''])
    Empleado = null;
    Empleado_Empleado: Empleado;
    @FormField('Asegurado', [''])
    Asegurado = null;
    Asegurado_Beneficiarios_de_Empleado: Beneficiarios_de_Empleado;
    @FormField('Fecha_del_evento', ['', Validators.required])
    Fecha_del_evento = '';
    @FormField('Tipo_de_siniestro', [''])
    Tipo_de_siniestro = null;
    Tipo_de_siniestro_Tipo_de_Siniestro: Tipo_de_Siniestro;
    @FormField('Apoyo_legal', [''])
    Apoyo_legal = null;
    Apoyo_legal_Respuesta: Respuesta;
    @FormField('Comentarios_de_apoyo_legal', ['', Validators.required])
    Comentarios_de_apoyo_legal = '';
    @FormField('Numero_de_siniestro', ['', Validators.required])
    Numero_de_siniestro = '';
    @FormField('Monto_total_a_pagar', ['', Validators.required])
    Monto_total_a_pagar = null;

     @FormField('Vida_Siniestros', [''])
     Vida_Siniestros: Vida_Siniestro[] = [];
        
}

