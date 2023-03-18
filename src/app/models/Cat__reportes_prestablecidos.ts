import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Cat__reportes_prestablecidos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Reporte_de_inspeccion_de_entrada', [''])
    Reporte_de_inspeccion_de_entrada = '';
    @FormField('Tipo_de_reporte', [''])
    Tipo_de_reporte = '';
    @FormField('Prioridad', [''])
    Prioridad = '';
    @FormField('Tipo_de_Codigo', [''])
    Tipo_de_Codigo = '';
    @FormField('Codigo_NP', [''])
    Codigo_NP = '';
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Cat__reportes_prestablecidoss', [''])
     Cat__reportes_prestablecidoss: Cat__reportes_prestablecidos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

