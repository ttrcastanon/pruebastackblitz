import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Modelos } from './Modelos';
import { Tipos_de_Curso } from './Tipos_de_Curso';


export class Detalle_de_Documentos_Cursos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdConfiguracion = 0;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Tipo_de_curso', [''])
    Tipo_de_curso = null;
    Tipo_de_curso_Tipos_de_Curso: Tipos_de_Curso;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Fecha_de_Vencimiento', [''])
    Fecha_de_Vencimiento = '';
    @FormField('Documento', [''])
    Documento = null;
    @FormField('DocumentoFile', [''])
    DocumentoFile: FileInput = null;

     @FormField('Detalle_de_Documentos_Cursoss', [''])
     Detalle_de_Documentos_Cursoss: Detalle_de_Documentos_Cursos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

