﻿import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipos_de_Origen_del_Componente  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipos_de_Origen_del_Componentes', [''])
     Tipos_de_Origen_del_Componentes: Tipos_de_Origen_del_Componente[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

