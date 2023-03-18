import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Calendario_Configuracion } from './Calendario_Configuracion';


export class MS_Calendario_Configuracion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    ID_Calendario_Rol = 0;
    @FormField('Descripcion', [''])
    Descripcion = null;
    Descripcion_Calendario_Configuracion: Calendario_Configuracion;

     @FormField('MS_Calendario_Configuracions', [''])
     MS_Calendario_Configuracions: MS_Calendario_Configuracion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

