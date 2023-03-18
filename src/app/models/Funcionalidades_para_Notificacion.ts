import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { MS_Campos_por_Funcionalidad } from './MS_Campos_por_Funcionalidad';
import { Estatus_de_Funcionalidad_para_Notificacion } from './Estatus_de_Funcionalidad_para_Notificacion';


export class Funcionalidades_para_Notificacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Funcionalidad', [''])
    Funcionalidad = '';
    @FormField('Nombre_de_la_Tabla', [''])
    Nombre_de_la_Tabla = '';
    @FormField('MS_Campos_por_FuncionalidadItems', [], MS_Campos_por_Funcionalidad,  true)
    MS_Campos_por_FuncionalidadItems: FormArray;

    @FormField('Campos_de_Estatus', [''])
    Campos_de_Estatus = null;
    Campos_de_Estatus_Estatus_de_Funcionalidad_para_Notificacion: Estatus_de_Funcionalidad_para_Notificacion;
    @FormField('Validacion_Obligatoria', [''])
    Validacion_Obligatoria = '';

     @FormField('Funcionalidades_para_Notificacions', [''])
     Funcionalidades_para_Notificacions: Funcionalidades_para_Notificacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

