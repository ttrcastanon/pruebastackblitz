import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Cursos_Pasajeros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Curso', [''])
    Curso = '';
    @FormField('Descripcion_del_Curso', [''])
    Descripcion_del_Curso = '';
    @FormField('Fecha_del_Curso', [''])
    Fecha_del_Curso = '';
    @FormField('Vencimiento', [false])
    Vencimiento = false;
    @FormField('Fecha_de_Vencimiento', [false])
    Fecha_de_Vencimiento = false;
    @FormField('Cargar_documento', [''])
    Cargar_documento = null;
    @FormField('Cargar_documentoFile', [''])
    Cargar_documentoFile: FileInput = null;

     @FormField('Detalle_Cursos_Pasajeross', [''])
     Detalle_Cursos_Pasajeross: Detalle_Cursos_Pasajeros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

