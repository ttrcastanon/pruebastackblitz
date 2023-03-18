import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Modelos } from './Modelos';


export class Catalogo_codigo_ATA  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = '';
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Codigo_ATA_Descripcion', [''])
    Codigo_ATA_Descripcion = '';
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;

     @FormField('Catalogo_codigo_ATAs', [''])
     Catalogo_codigo_ATAs: Catalogo_codigo_ATA[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

