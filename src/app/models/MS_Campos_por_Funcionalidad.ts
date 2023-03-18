import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Nombre_del_Campo_en_MS } from './Nombre_del_Campo_en_MS';


export class MS_Campos_por_Funcionalidad  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Folio_Funcionalidades_Notificacion = 0;
    @FormField('Campo', [''])
    Campo = null;
    Campo_Nombre_del_Campo_en_MS: Nombre_del_Campo_en_MS;

     @FormField('MS_Campos_por_Funcionalidads', [''])
     MS_Campos_por_Funcionalidads: MS_Campos_por_Funcionalidad[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

