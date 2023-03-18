import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Tipo_de_carga } from './Tipo_de_carga';


export class Carga_Manual  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_carga', [''])
    Fecha_de_carga = '';
    @FormField('Hora_de_carga', [''])
    Hora_de_carga = '';
    @FormField('Usuario', [''])
    Usuario = null;
    Usuario_Spartan_User: Spartan_User;
    @FormField('Tipo_de_carga', [''])
    Tipo_de_carga = null;
    Tipo_de_carga_Tipo_de_carga: Tipo_de_carga;
    @FormField('Archivo_a_cargar', [''])
    Archivo_a_cargar = null;
    @FormField('Archivo_a_cargarFile', [''])
    Archivo_a_cargarFile: FileInput = null;

     @FormField('Carga_Manuals', [''])
     Carga_Manuals: Carga_Manual[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

