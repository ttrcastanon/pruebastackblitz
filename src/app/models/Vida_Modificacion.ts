import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Tramite } from './Solicitud_de_Tramite';
import { Beneficiarios_de_Empleado } from './Beneficiarios_de_Empleado';
import { Tipo_de_Modificacion } from './Tipo_de_Modificacion';
import { Genero } from './Genero';
import { Parentesco } from './Parentesco';


export class Vida_Modificacion  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Solicitud_de_Tramite', [''])
    Solicitud_de_Tramite = null;
    Solicitud_de_Tramite_Solicitud_de_Tramite: Solicitud_de_Tramite;
    @FormField('Beneficiario', [''])
    Beneficiario = null;
    Beneficiario_Beneficiarios_de_Empleado: Beneficiarios_de_Empleado;
    @FormField('Modificacion_Requerida', [''])
    Modificacion_Requerida = null;
    Modificacion_Requerida_Tipo_de_Modificacion: Tipo_de_Modificacion;
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

     @FormField('Vida_Modificacions', [''])
     Vida_Modificacions: Vida_Modificacion[] = [];
        
}

