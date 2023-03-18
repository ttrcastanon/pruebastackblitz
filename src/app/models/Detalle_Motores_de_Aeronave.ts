import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Motores } from './Motores';


export class Detalle_Motores_de_Aeronave  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    idAeronave = '';
    @FormField('Motor', ['',Validators.required] )
    Motor = null;
    Motor_Motores: Motores;
    @FormField('Marca', ['',Validators.required])
    Marca = '';
    @FormField('Modelo', ['',Validators.required])
    Modelo = '';
    @FormField('No__Serie', ['',Validators.required])
    No__Serie = '';

     @FormField('Detalle_Motores_de_Aeronaves', [''])
     Detalle_Motores_de_Aeronaves: Detalle_Motores_de_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

