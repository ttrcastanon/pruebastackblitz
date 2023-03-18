import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';


export class Tipo_de_Cambio  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('T_C__USD', [''])
    T_C__USD = null;
    @FormField('T_C__EUR', [''])
    T_C__EUR = null;
    @FormField('T_C__LIBRA', [''])
    T_C__LIBRA = null;
    @FormField('T_C__CAD', [''])
    T_C__CAD = null;
    @FormField('Fecha_de_Edicion', [''])
    Fecha_de_Edicion = '';
    @FormField('Hora_de_Edicion', [''])
    Hora_de_Edicion = '';
    @FormField('Usuario_que_Edita', [''])
    Usuario_que_Edita = null;
    Usuario_que_Edita_Spartan_User: Spartan_User;

     @FormField('Tipo_de_Cambios', [''])
     Tipo_de_Cambios: Tipo_de_Cambio[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

