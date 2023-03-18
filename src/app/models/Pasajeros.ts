import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pais } from './Pais';
import { Genero } from './Genero';
import { Respuesta } from './Respuesta';
import { Estatus_Aeronave } from './Estatus_Aeronave';


export class Pasajeros  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Identificador_Alias', [''])
    Identificador_Alias = '';
    @FormField('Nombre_s', [''])
    Nombre_s = '';
    @FormField('Apellido_paterno', [''])
    Apellido_paterno = '';
    @FormField('Apellido_materno', [''])
    Apellido_materno = '';
    @FormField('Nombre_completo', [''])
    Nombre_completo = '';
    @FormField('Telefono', [''])
    Telefono = '';
    @FormField('Celular', [''])
    Celular = '';
    @FormField('Correo_electronico', [''])
    Correo_electronico = '';
    @FormField('Fecha_de_nacimiento', [''])
    Fecha_de_nacimiento = '';
    @FormField('Edad', [0])
    Edad = null;
    @FormField('Nacionalidad_1', [''])
    Nacionalidad_1 = null;
    Nacionalidad_1_Pais: Pais;
    @FormField('Nacionalidad_2', [''])
    Nacionalidad_2 = null;
    Nacionalidad_2_Pais: Pais;
    @FormField('Genero', [''])
    Genero = null;
    Genero_Genero: Genero;
    @FormField('Pertenece_al_grupo', [''])
    Pertenece_al_grupo = null;
    Pertenece_al_grupo_Respuesta: Respuesta;
    @FormField('Activo', [''])
    Activo = null;
    Activo_Estatus_Aeronave: Estatus_Aeronave;
    @FormField('Numero_de_Pasaporte_1', [''])
    Numero_de_Pasaporte_1 = '';
    @FormField('Fecha_de_Emision_Pasaporte_1', [''])
    Fecha_de_Emision_Pasaporte_1 = '';
    @FormField('Fecha_de_vencimiento_pasaporte_1', [''])
    Fecha_de_vencimiento_pasaporte_1 = '';
    @FormField('Alerta_de_vencimiento_pasaporte_1', [false])
    Alerta_de_vencimiento_pasaporte_1 = false;
    @FormField('Pais', [''])
    Pais = null;
    Pais_Pais: Pais;
    @FormField('Cargar_Pasaporte_1', [''])
    Cargar_Pasaporte_1 = null;
    @FormField('Cargar_Pasaporte_1File', [''])
    Cargar_Pasaporte_1File: FileInput = null;
    @FormField('Numero_de_Pasaporte_2', [''])
    Numero_de_Pasaporte_2 = '';
    @FormField('Fecha_de_Emision_Pasaporte_2', [''])
    Fecha_de_Emision_Pasaporte_2 = '';
    @FormField('Fecha_de_vencimiento_pasaporte_2', [''])
    Fecha_de_vencimiento_pasaporte_2 = '';
    @FormField('Alerta_de_vencimiento_pasaporte_2', [false])
    Alerta_de_vencimiento_pasaporte_2 = false;
    @FormField('Pais_1', [''])
    Pais_1 = null;
    Pais_1_Pais: Pais;
    @FormField('Cargar_Pasaporte_2', [''])
    Cargar_Pasaporte_2 = null;
    @FormField('Cargar_Pasaporte_2File', [''])
    Cargar_Pasaporte_2File: FileInput = null;
    @FormField('Numero_de_Visa_1', [''])
    Numero_de_Visa_1 = '';
    @FormField('Fecha_de_Emision_Visa_1', [''])
    Fecha_de_Emision_Visa_1 = '';
    @FormField('Fecha_de_vencimiento_visa_1', [''])
    Fecha_de_vencimiento_visa_1 = '';
    @FormField('Alerta_de_vencimiento_Visa_1', [false])
    Alerta_de_vencimiento_Visa_1 = false;
    @FormField('Pais_2', [''])
    Pais_2 = null;
    Pais_2_Pais: Pais;
    @FormField('Cargar_Visa_1', [''])
    Cargar_Visa_1 = null;
    @FormField('Cargar_Visa_1File', [''])
    Cargar_Visa_1File: FileInput = null;
    @FormField('Numero_de_Visa_2', [''])
    Numero_de_Visa_2 = '';
    @FormField('Fecha_de_Emision_Visa_2', [''])
    Fecha_de_Emision_Visa_2 = '';
    @FormField('Fecha_de_vencimiento_visa_2', [''])
    Fecha_de_vencimiento_visa_2 = '';
    @FormField('Alerta_de_vencimiento_visa_2', [false])
    Alerta_de_vencimiento_visa_2 = false;
    @FormField('Pais_4', [''])
    Pais_4 = null;
    Pais_4_Pais: Pais;
    @FormField('Cargar_Visa_2', [''])
    Cargar_Visa_2 = null;
    @FormField('Cargar_Visa_2File', [''])
    Cargar_Visa_2File: FileInput = null;

     @FormField('Pasajeross', [''])
     Pasajeross: Pasajeros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

