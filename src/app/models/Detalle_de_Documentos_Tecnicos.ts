import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_de_Documentos_Tecnicos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdConfiguracion = 0;
    @FormField('Documento', [''])
    Documento = null;
    @FormField('DocumentoFile', [''])
    DocumentoFile: FileInput = null;
    @FormField('N_de_Documento', [0])
    N_de_Documento = null;
    @FormField('Fecha_de_Vencimiento', [''])
    Fecha_de_Vencimiento = '';

     @FormField('Detalle_de_Documentos_Tecnicoss', [''])
     Detalle_de_Documentos_Tecnicoss: Detalle_de_Documentos_Tecnicos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

