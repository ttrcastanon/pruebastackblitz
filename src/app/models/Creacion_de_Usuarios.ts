import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cargos } from './Cargos';
import { Spartan_User } from './Spartan_User';
import { Departamento } from './Departamento';
import { Estatus_de_Usuario } from './Estatus_de_Usuario';
import { Horarios_de_Trabajo } from './Horarios_de_Trabajo';
import { Detalle_Empresas_Conf_Usuario } from './Detalle_Empresas_Conf_Usuario';


export class Creacion_de_Usuarios  extends BaseView {
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
    @FormField('Curp', [''])
    Curp = '';
    @FormField('Fecha_de_Nacimiento', [''])
    Fecha_de_Nacimiento = '';
    @FormField('Fecha_de_Ingreso', [''])
    Fecha_de_Ingreso = '';
    @FormField('Creacion_de_Usuario', [''])
    Creacion_de_Usuario = '';
    @FormField('Edad', [''])
    Edad = '';
    @FormField('Tiempo_en_la_Empresa', [''])
    Tiempo_en_la_Empresa = '';
    @FormField('Cargo_desempenado', [''])
    Cargo_desempenado = null;
    Cargo_desempenado_Cargos: Cargos;
    @FormField('Jefe_inmediato', [''])
    Jefe_inmediato = null;
    Jefe_inmediato_Spartan_User: Spartan_User;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Usuario', [''])
    Usuario = '';
    @FormField('Contrasena', [''])
    Contrasena = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Usuario: Estatus_de_Usuario;
    @FormField('Correo_electronico', [''])
    Correo_electronico = '';
    @FormField('Telefono', [''])
    Telefono = '';
    @FormField('Celular', [''])
    Celular = '';
    @FormField('Direccion', [''])
    Direccion = '';
    @FormField('Horario_de_trabajo', [''])
    Horario_de_trabajo = null;
    Horario_de_trabajo_Horarios_de_Trabajo: Horarios_de_Trabajo;
    @FormField('Firma_digital', [''])
    Firma_digital = null;
    @FormField('Firma_digitalFile', [''])
    Firma_digitalFile: FileInput = null;
    @FormField('Usuario_Registrado', [0])
    Usuario_Registrado = null;
    @FormField('Detalle_Empresas_Conf_UsuarioItems', [], Detalle_Empresas_Conf_Usuario,  true)
    Detalle_Empresas_Conf_UsuarioItems: FormArray;


     @FormField('Creacion_de_Usuarioss', [''])
     Creacion_de_Usuarioss: Creacion_de_Usuarios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

