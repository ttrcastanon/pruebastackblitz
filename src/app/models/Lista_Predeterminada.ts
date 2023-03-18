import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Detalle_de_Lista_Predeterminada } from './Detalle_de_Lista_Predeterminada';


export class Lista_Predeterminada  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Nombre_de_Lista_Predeterminada', [''])
    Nombre_de_Lista_Predeterminada = '';
    @FormField('Detalle_de_Lista_PredeterminadaItems', [], Detalle_de_Lista_Predeterminada,  true)
    Detalle_de_Lista_PredeterminadaItems: FormArray;


     @FormField('Lista_Predeterminadas', [''])
     Lista_Predeterminadas: Lista_Predeterminada[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

