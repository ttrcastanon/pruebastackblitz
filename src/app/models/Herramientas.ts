import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Categoria_de_Partes } from './Categoria_de_Partes';
import { Catalago_Manual_de_Usuario } from './Catalago_Manual_de_Usuario';


export class Herramientas  extends BaseView {
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
    @FormField('No_de_Serie', [''])
    No_de_Serie = '';
    @FormField('Codigo_de_calibracion', [''])
    Codigo_de_calibracion = '';
    @FormField('Manual_del_Usuario', [''])
    Manual_del_Usuario = null;
    Manual_del_Usuario_Catalago_Manual_de_Usuario: Catalago_Manual_de_Usuario;
    @FormField('Alcance', [''])
    Alcance = '';

     @FormField('Herramientass', [''])
     Herramientass: Herramientas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

