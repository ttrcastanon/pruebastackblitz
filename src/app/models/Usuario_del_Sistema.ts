import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Rol_de_Usuario } from './Rol_de_Usuario';
//@@Begin.Keep.Implementation('import { Estatus_de_usuario }')
import { Estatus_de_usuario } from './Estatus_de_usuario';
import { Ramos_y_Empresas_de_Usuario } from './Ramos_y_Empresas_de_Usuario';
//@@End.Keep.Implementation('export class Usuario_del_Sistema')


export class Usuario_del_Sistema  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Nombre_completo', ['', Validators.required])
    Nombre_completo = '';
    @FormField('Rol', [''])
    Rol = null;
    Rol_Rol_de_Usuario: Rol_de_Usuario;
    @FormField('Clave_de_acceso', ['', Validators.required])
    Clave_de_acceso = '';
    @FormField('Contrasena', ['', Validators.required])
    Contrasena = '';
    @FormField('Email', ['', Validators.required])
    Email = '';
    @FormField('Estatus_de_usuario', [''])
    Estatus_de_usuario = null;
    Estatus_de_usuario_Estatus_de_usuario: Estatus_de_usuario;
    //@@Begin.Keep.Implementation('@FormField('Ramos_y_Empresas_de_Usuario')
    @FormField('Ramos_y_Empresas_de_Usuario', [[]])
    Ramos_y_Empresas_de_Usuario: Ramos_y_Empresas_de_Usuario[] = [];
    //@@End.Keep.Implementation('@FormField('Usuario_del_Sistemas')
     @FormField('Usuario_del_Sistemas', [''])
     Usuario_del_Sistemas: Usuario_del_Sistema[] = [];
        
}

