﻿import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Clasificacion_de_aeronavegabilidad  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Clasificacion_de_aeronavegabilidads', [''])
     Clasificacion_de_aeronavegabilidads: Clasificacion_de_aeronavegabilidad[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

