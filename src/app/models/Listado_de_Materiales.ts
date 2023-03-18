import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Categoria_de_Partes } from './Categoria_de_Partes';


export class Listado_de_Materiales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Codigo', [''])
    Codigo = '';
    @FormField('Categoria', [''])
    Categoria = null;
    Categoria_Categoria_de_Partes: Categoria_de_Partes;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Codigo_Descripcion', [''])
    Codigo_Descripcion = '';

     @FormField('Listado_de_Materialess', [''])
     Listado_de_Materialess: Listado_de_Materiales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

