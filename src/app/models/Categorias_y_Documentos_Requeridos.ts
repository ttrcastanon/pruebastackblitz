import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Categoria_de_Partes } from './Categoria_de_Partes';
import { Documentos_Requeridos } from './Documentos_Requeridos';


export class Categorias_y_Documentos_Requeridos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Categoria', [''])
    Categoria = null;
    Categoria_Categoria_de_Partes: Categoria_de_Partes;
    @FormField('Documento', [''])
    Documento = null;
    Documento_Documentos_Requeridos: Documentos_Requeridos;

     @FormField('Categorias_y_Documentos_Requeridoss', [''])
     Categorias_y_Documentos_Requeridoss: Categorias_y_Documentos_Requeridos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

