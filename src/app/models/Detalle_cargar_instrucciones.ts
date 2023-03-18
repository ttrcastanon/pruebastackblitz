import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_cargar_instrucciones  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdBoletines_Directivas = 0;
    @FormField('Cargar_Instrucciones', [''])
    Cargar_Instrucciones = null;
    @FormField('Cargar_InstruccionesFile', [''])
    Cargar_InstruccionesFile: FileInput = null;

     @FormField('Detalle_cargar_instruccioness', [''])
     Detalle_cargar_instruccioness: Detalle_cargar_instrucciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;

     Cargar_Instrucciones_Spartane_File: any;
}

