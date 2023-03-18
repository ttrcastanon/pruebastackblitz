import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Categoria_de_Partes } from './Categoria_de_Partes';


export class Catalogo_servicios  extends BaseView {
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

     @FormField('Catalogo_servicioss', [''])
     Catalogo_servicioss: Catalogo_servicios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

