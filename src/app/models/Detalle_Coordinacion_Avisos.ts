import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Aviso } from './Tipo_de_Aviso';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coordinacion_Avisos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Avisos = 0;
    @FormField('Aviso', [''])
    Aviso = null;
    Aviso_Tipo_de_Aviso: Tipo_de_Aviso;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Confirmado_por_Correo', [false])
    Confirmado_por_Correo = false;
    @FormField('Confirmado_por_Telefono', [false])
    Confirmado_por_Telefono = false;
    @FormField('Comentarios', [''])
    Comentarios = '';
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coordinacion_Avisoss', [''])
     Detalle_Coordinacion_Avisoss: Detalle_Coordinacion_Avisos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

