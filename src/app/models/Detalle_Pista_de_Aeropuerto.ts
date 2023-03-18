import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Pista_de_Aeropuerto  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    IdAeropuerto = 0;
    @FormField('Pista_Id', [''])
    Pista_Id = '';
    @FormField('Longitud', [0])
    Longitud = null;
    @FormField('Ancho', [0])
    Ancho = null;
    @FormField('Superficie', [''])
    Superficie = '';
    @FormField('Iluminacion', [''])
    Iluminacion = '';
    @FormField('Pavimento', [''])
    Pavimento = '';

     @FormField('Detalle_Pista_de_Aeropuertos', [''])
     Detalle_Pista_de_Aeropuertos: Detalle_Pista_de_Aeropuerto[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

