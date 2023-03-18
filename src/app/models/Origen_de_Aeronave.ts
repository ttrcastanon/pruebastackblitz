﻿import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Origen_de_Aeronave  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Origen_de_Aeronaves', [''])
     Origen_de_Aeronaves: Origen_de_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

