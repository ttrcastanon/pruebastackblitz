import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Documentos_Requeridos } from './Documentos_Requeridos';


export class Detalle_Cargar_inspecciones_de_calidad  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Inspeccion_de_Calidad', [''])
    Inspeccion_de_Calidad = null;
    @FormField('Inspeccion_de_CalidadFile', [''])
    Inspeccion_de_CalidadFile: FileInput = null;
    Cargar_inspecciones_de_calidad = 0;
    @FormField('Nombre_de_documento', [''])
    Nombre_de_documento = null;
    Nombre_de_documento_Documentos_Requeridos: Documentos_Requeridos;

     @FormField('Detalle_Cargar_inspecciones_de_calidads', [''])
     Detalle_Cargar_inspecciones_de_calidads: Detalle_Cargar_inspecciones_de_calidad[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

