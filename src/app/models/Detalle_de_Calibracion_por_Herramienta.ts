import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_Calibracion } from './Estatus_de_Calibracion';


export class Detalle_de_Calibracion_por_Herramienta  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Control_Calibracion_Equipo_Herramienta = 0;
    @FormField('Fecha_Ultima_Calibracion', [''])
    Fecha_Ultima_Calibracion = '';
    @FormField('Fecha_Proxima_Calibracion', [''])
    Fecha_Proxima_Calibracion = '';
    @FormField('Certificado_de_Calibracion', [''])
    Certificado_de_Calibracion = null;
    @FormField('Certificado_de_CalibracionFile', [''])
    Certificado_de_CalibracionFile: FileInput = null;
    @FormField('Manual_del_Usuario', [''])
    Manual_del_Usuario = '';
    @FormField('Alcance', [''])
    Alcance = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Calibracion: Estatus_de_Calibracion;
    @FormField('Notas', [''])
    Notas = '';

     @FormField('Detalle_de_Calibracion_por_Herramientas', [''])
     Detalle_de_Calibracion_por_Herramientas: Detalle_de_Calibracion_por_Herramienta[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

