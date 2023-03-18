import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class detalle_de_imagenes_de_aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    id_aeronave = '';
    @FormField('Fotografia', [''])
    Fotografia = null;
    @FormField('FotografiaFile', ['',Validators.required])
    FotografiaFile: FileInput = null;

     @FormField('detalle_de_imagenes_de_aeronaves', [''])
     detalle_de_imagenes_de_aeronaves: detalle_de_imagenes_de_aeronave[] = [];

     edit = false;
     isNew = false;        
     @FormField('IsDeleted', [false])    
     IsDeleted = false;
     Fotografia_Spartane_File: any;
}

