import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pais } from './Pais';
import { Genero } from './Genero';
import { Tipo_de_Tripulante } from './Tipo_de_Tripulante';
import { Respuesta } from './Respuesta';
import { Estatus_Tripulacion } from './Estatus_Tripulacion';
import { Tripulacion_Aeronave } from './Tripulacion_Aeronave';
import { Creacion_de_Usuarios } from './Creacion_de_Usuarios';
import { Detalle_Cursos_de_Tripulacion } from './Detalle_Cursos_de_Tripulacion';


export class Tripulacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Nombres', [''])
    Nombres = '';
    @FormField('Apellido_paterno', [''])
    Apellido_paterno = '';
    @FormField('Apellido_materno', [''])
    Apellido_materno = '';
    @FormField('Nombre_completo', [''])
    Nombre_completo = '';
    @FormField('Direccion', [''])
    Direccion = '';
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
    @FormField('Tipo_de_Tripulante', [''])
    Tipo_de_Tripulante = null;
    Tipo_de_Tripulante_Tipo_de_Tripulante: Tipo_de_Tripulante;
    @FormField('Pertenece_al_grupo', [''])
    Pertenece_al_grupo = null;
    Pertenece_al_grupo_Respuesta: Respuesta;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Tripulacion: Estatus_Tripulacion;
    @FormField('Tripulacion_AeronaveItems', [], Tripulacion_Aeronave,  true)
    Tripulacion_AeronaveItems: FormArray;

    @FormField('Usuario_Relacionado', [''])
    Usuario_Relacionado = null;
    Usuario_Relacionado_Creacion_de_Usuarios: Creacion_de_Usuarios;
    @FormField('Fotografia', [''])
    Fotografia = null;
    @FormField('FotografiaFile', [''])
    FotografiaFile: FileInput = null;
    @FormField('Numero_de_Licencia', [''])
    Numero_de_Licencia = '';
    @FormField('Fecha_de_Emision_Licencia', [''])
    Fecha_de_Emision_Licencia = '';
    @FormField('Fecha_de_vencimiento_licencia', [''])
    Fecha_de_vencimiento_licencia = '';
    @FormField('Alerta_de_vencimiento_licencia', [false])
    Alerta_de_vencimiento_licencia = false;
    @FormField('Cargar_Licencia', [''])
    Cargar_Licencia = null;
    @FormField('Cargar_LicenciaFile', [''])
    Cargar_LicenciaFile: FileInput = null;
    @FormField('Certificado_Medico', [''])
    Certificado_Medico = '';
    @FormField('Fecha_de_Emision_Certificado', [''])
    Fecha_de_Emision_Certificado = '';
    @FormField('Fecha_de_vencimiento_certificado', [''])
    Fecha_de_vencimiento_certificado = '';
    @FormField('Alerta_de_vencimiento_certificado', [false])
    Alerta_de_vencimiento_certificado = false;
    @FormField('Cargar_Certificado_Medico', [''])
    Cargar_Certificado_Medico = null;
    @FormField('Cargar_Certificado_MedicoFile', [''])
    Cargar_Certificado_MedicoFile: FileInput = null;
    @FormField('Numero_de_Pasaporte_1', [''])
    Numero_de_Pasaporte_1 = '';
    @FormField('Fecha_de_Emision_Pasaporte_1', [''])
    Fecha_de_Emision_Pasaporte_1 = '';
    @FormField('Fecha_de_vencimiento_Pasaporte_1', [''])
    Fecha_de_vencimiento_Pasaporte_1 = '';
    @FormField('Alerta_de_vencimiento_Pasaporte_1', [false])
    Alerta_de_vencimiento_Pasaporte_1 = false;
    @FormField('Pais_1', [''])
    Pais_1 = null;
    Pais_1_Pais: Pais;
    @FormField('Cargar_Pasaporte_1', [''])
    Cargar_Pasaporte_1 = null;
    @FormField('Cargar_Pasaporte_1File', [''])
    Cargar_Pasaporte_1File: FileInput = null;
    @FormField('Numero_de_Pasaporte_2', [''])
    Numero_de_Pasaporte_2 = '';
    @FormField('Fecha_de_Emision_Pasaporte_2', [''])
    Fecha_de_Emision_Pasaporte_2 = '';
    @FormField('Fecha_de_vencimiento_Pasaporte_2', [''])
    Fecha_de_vencimiento_Pasaporte_2 = '';
    @FormField('Alerta_de_vencimiento_Pasaporte_2', [false])
    Alerta_de_vencimiento_Pasaporte_2 = false;
    @FormField('Pais_2', [''])
    Pais_2 = null;
    Pais_2_Pais: Pais;
    @FormField('Cargar_Pasaporte_2', [''])
    Cargar_Pasaporte_2 = null;
    @FormField('Cargar_Pasaporte_2File', [''])
    Cargar_Pasaporte_2File: FileInput = null;
    @FormField('Numero_de_Visa_1', [''])
    Numero_de_Visa_1 = '';
    @FormField('Fecha_de_Emision_visa_1', [''])
    Fecha_de_Emision_visa_1 = '';
    @FormField('Fecha_de_vencimiento_Visa_1', [''])
    Fecha_de_vencimiento_Visa_1 = '';
    @FormField('Alerta_de_vencimiento_Visa_1', [false])
    Alerta_de_vencimiento_Visa_1 = false;
    @FormField('Pais_3', [''])
    Pais_3 = null;
    Pais_3_Pais: Pais;
    @FormField('Cargar_Visa_1', [''])
    Cargar_Visa_1 = null;
    @FormField('Cargar_Visa_1File', [''])
    Cargar_Visa_1File: FileInput = null;
    @FormField('Numero_de_Visa_2', [''])
    Numero_de_Visa_2 = '';
    @FormField('Fecha_de_Emision_Visa_2', [''])
    Fecha_de_Emision_Visa_2 = '';
    @FormField('Fecha_de_vencimiento_Visa_2', [''])
    Fecha_de_vencimiento_Visa_2 = '';
    @FormField('Alerta_de_vencimiento_Visa_2', [false])
    Alerta_de_vencimiento_Visa_2 = false;
    @FormField('Pais_4', [''])
    Pais_4 = null;
    Pais_4_Pais: Pais;
    @FormField('Cargar_Visa_2', [''])
    Cargar_Visa_2 = null;
    @FormField('Cargar_Visa_2File', [''])
    Cargar_Visa_2File: FileInput = null;
    @FormField('Detalle_Cursos_de_TripulacionItems', [], Detalle_Cursos_de_Tripulacion,  true)
    Detalle_Cursos_de_TripulacionItems: FormArray;


     @FormField('Tripulacions', [''])
     Tripulacions: Tripulacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

