import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';


export class Lista_Predeterminada_Seleccionar  extends BaseView {

    @FormField('Seleccionar', [false])
    Seleccionar = false;

    @FormField('Folio', [0])
    Folio = 0;    

    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;

    @FormField('Nombre_Usuario_que_Registra', [''])
    Nombre_Usuario_que_Registra = null;

    @FormField('Nombre_de_Lista_Predeterminada', [''])
    Nombre_de_Lista_Predeterminada = '';

    @FormField('Lista_Predeterminada_SeleccionarItems', [], Lista_Predeterminada_Seleccionar,  true)
    Lista_Predeterminada_SeleccionarItems: FormArray;


     @FormField('Lista_Predeterminada_Seleccionar', [''])
     Lista_Predeterminada_Seleccionar: Lista_Predeterminada_Seleccionar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

