import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Categoria_de_Partes } from './Categoria_de_Partes';


export class Partes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_parte', [''])
    Numero_de_parte = '';
    @FormField('Categoria', [''])
    Categoria = null;
    Categoria_Categoria_de_Partes: Categoria_de_Partes;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Numero_de_parte_Descripcion', [''])
    Numero_de_parte_Descripcion = '';

     @FormField('Partess', [''])
     Partess: Partes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

