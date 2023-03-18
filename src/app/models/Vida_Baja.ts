import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Tramite } from './Solicitud_de_Tramite';
import { Beneficiarios_de_Empleado } from './Beneficiarios_de_Empleado';


export class Vida_Baja  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Solicitud_de_Tramite', [''])
    Solicitud_de_Tramite = null;
    Solicitud_de_Tramite_Solicitud_de_Tramite: Solicitud_de_Tramite;
    @FormField('Conyuge', [''])
    Conyuge = null;
    Conyuge_Beneficiarios_de_Empleado: Beneficiarios_de_Empleado;
    @FormField('Fecha_de_Baja', ['', Validators.required])
    Fecha_de_Baja = '';

     @FormField('Vida_Bajas', [''])
     Vida_Bajas: Vida_Baja[] = [];
        
}

