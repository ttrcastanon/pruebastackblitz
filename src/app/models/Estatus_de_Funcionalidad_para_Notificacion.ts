import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_de_Funcionalidad_para_Notificacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Campo_para_Estatus', [''])
    Campo_para_Estatus = '';
    @FormField('Nombre_Fisico_del_Campo', [''])
    Nombre_Fisico_del_Campo = '';
    @FormField('Nombre_Fisico_de_la_Tabla', [''])
    Nombre_Fisico_de_la_Tabla = '';

     @FormField('Estatus_de_Funcionalidad_para_Notificacions', [''])
     Estatus_de_Funcionalidad_para_Notificacions: Estatus_de_Funcionalidad_para_Notificacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

