import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Herramientas } from './Herramientas';
import { Estatus_de_Calibracion } from './Estatus_de_Calibracion';
import { Detalle_de_Calibracion_por_Herramienta } from './Detalle_de_Calibracion_por_Herramienta';


export class Control_de_Calibracion_de_Equipo_y_Herramienta  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_de_Codigo', [''])
    No_de_Codigo = null;
    No_de_Codigo_Herramientas: Herramientas;
    @FormField('No__de_Parte___Descripcion', [''])
    No__de_Parte___Descripcion = '';
    @FormField('No__de_Serie', [''])
    No__de_Serie = '';
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
    @FormField('Detalle_de_Calibracion_por_HerramientaItems', [], Detalle_de_Calibracion_por_Herramienta,  true)
    Detalle_de_Calibracion_por_HerramientaItems: FormArray;


     @FormField('Control_de_Calibracion_de_Equipo_y_Herramientas', [''])
     Control_de_Calibracion_de_Equipo_y_Herramientas: Control_de_Calibracion_de_Equipo_y_Herramienta[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

