import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_Cliente } from './Estatus_de_Cliente';
import { Respuesta } from './Respuesta';


export class Creacion_de_Clientes  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Razon_Social', [''])
    Razon_Social = '';
    @FormField('Contacto', [''])
    Contacto = '';
    @FormField('Correo_Electronico', [''])
    Correo_Electronico = '';
    @FormField('Direccion_Fiscal', [''])
    Direccion_Fiscal = '';
    @FormField('Direccion_Postal', [''])
    Direccion_Postal = '';
    @FormField('Telefono_de_Contacto', [''])
    Telefono_de_Contacto = '';
    @FormField('ID_Dynamics', [''])
    ID_Dynamics = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Cliente: Estatus_de_Cliente;
    @FormField('Pertenece_a_grupo_BAL', [''])
    Pertenece_a_grupo_BAL = null;
    Pertenece_a_grupo_BAL_Respuesta: Respuesta;

     @FormField('Creacion_de_Clientess', [''])
     Creacion_de_Clientess: Creacion_de_Clientes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

