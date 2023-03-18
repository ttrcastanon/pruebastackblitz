import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cargos } from './Cargos';
import { Spartan_User } from './Spartan_User';
import { Tecnico_Aeronave } from './Tecnico_Aeronave';
import { Creacion_de_Usuarios } from './Creacion_de_Usuarios';
import { Pais } from './Pais';
import { Detalle_de_Documentos_Cursos } from './Detalle_de_Documentos_Cursos';


export class Configuracion_de_tecnicos_e_inspectores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Nombres', [''])
    Nombres = '';
    @FormField('Apellido_paterno', [''])
    Apellido_paterno = '';
    @FormField('Apellido_materno', [''])
    Apellido_materno = '';
    @FormField('Nombre_completo', [''])
    Nombre_completo = '';
    @FormField('Cargo_desempenado', [''])
    Cargo_desempenado = null;
    Cargo_desempenado_Cargos: Cargos;
    @FormField('Correo_electronico', [''])
    Correo_electronico = '';
    @FormField('Celular', [''])
    Celular = '';
    @FormField('Telefono', [''])
    Telefono = '';
    @FormField('Direccion', [''])
    Direccion = '';
    @FormField('Usuario_Registrado', [''])
    Usuario_Registrado = null;
    Usuario_Registrado_Spartan_User: Spartan_User;
    @FormField('Tecnico_AeronaveItems', [], Tecnico_Aeronave,  true)
    Tecnico_AeronaveItems: FormArray;

    @FormField('Usuario_Relacionado', [''])
    Usuario_Relacionado = null;
    Usuario_Relacionado_Creacion_de_Usuarios: Creacion_de_Usuarios;
    @FormField('Numero_de_Licencia', [''])
    Numero_de_Licencia = '';
    @FormField('Fecha_de_Emision_Licencia', [''])
    Fecha_de_Emision_Licencia = '';
    @FormField('Fecha_de_vencimiento', [''])
    Fecha_de_vencimiento = '';
    @FormField('Alerta_de_vencimiento', [false])
    Alerta_de_vencimiento = false;
    @FormField('Cargar_Licencia', [''])
    Cargar_Licencia = null;
    @FormField('Cargar_LicenciaFile', [''])
    Cargar_LicenciaFile: FileInput = null;
    @FormField('Certificado_Medico', [''])
    Certificado_Medico = '';
    @FormField('Fecha_de_Emision_Certificado', [''])
    Fecha_de_Emision_Certificado = '';
    @FormField('Fecha_de_vencimiento_cert', [''])
    Fecha_de_vencimiento_cert = '';
    @FormField('Alerta_de_vencimiento_cert', [false])
    Alerta_de_vencimiento_cert = false;
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
    @FormField('Fecha_de_Emision_Visa_1', [''])
    Fecha_de_Emision_Visa_1 = '';
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
    @FormField('Detalle_de_Documentos_CursosItems', [], Detalle_de_Documentos_Cursos,  true)
    Detalle_de_Documentos_CursosItems: FormArray;


     @FormField('Configuracion_de_tecnicos_e_inspectoress', [''])
     Configuracion_de_tecnicos_e_inspectoress: Configuracion_de_tecnicos_e_inspectores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

