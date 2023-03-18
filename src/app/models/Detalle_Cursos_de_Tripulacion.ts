import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Modelos } from './Modelos';
import { Tipos_de_Curso } from './Tipos_de_Curso';


export class Detalle_Cursos_de_Tripulacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    IdTripulacion = 0;
    @FormField('MODELO', [''])
    MODELO = null;
    MODELO_Modelos: Modelos;
    @FormField('TIPO_DE_CURSO', [''])
    TIPO_DE_CURSO = null;
    TIPO_DE_CURSO_Tipos_de_Curso: Tipos_de_Curso;
    @FormField('DESCRIPCION', [''])
    DESCRIPCION = '';
    @FormField('FECHA_DE_VENCIMIENT', [''])
    FECHA_DE_VENCIMIENT = '';
    @FormField('DOCUMENTO', [''])
    DOCUMENTO = null;
    @FormField('DOCUMENTOFile', [''])
    DOCUMENTOFile: FileInput = null;

     @FormField('Detalle_Cursos_de_Tripulacions', [''])
     Detalle_Cursos_de_Tripulacions: Detalle_Cursos_de_Tripulacion[] = [];

     edit = false;
     isNew = false;    
     @FormField('IsDeleted', [false])    
     IsDeleted = false;
}

