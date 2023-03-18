import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_Cliente } from './Estatus_de_Cliente';
import { Respuesta } from './Respuesta';
import { Tipo_de_Cliente } from './Tipo_de_Cliente';


export class Cliente  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('ID_Dynamics', [''])
    ID_Dynamics = '';
    @FormField('RFC', [''])
    RFC = '';
    @FormField('Razon_Social', [''])
    Razon_Social = '';
    @FormField('Nombre_Corto', [''])
    Nombre_Corto = '';
    @FormField('Contacto', [''])
    Contacto = '';
    @FormField('Direccion_Fiscal', [''])
    Direccion_Fiscal = '';
    @FormField('Direccion_Postal', [''])
    Direccion_Postal = '';
    @FormField('Correo_Electronico', [''])
    Correo_Electronico = '';
    @FormField('Telefono_de_Contacto', [''])
    Telefono_de_Contacto = '';
    @FormField('Telefono_de_Contacto_2', [''])
    Telefono_de_Contacto_2 = '';
    @FormField('Celular_de_Contacto', [''])
    Celular_de_Contacto = '';
    @FormField('Fax', [''])
    Fax = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Cliente: Estatus_de_Cliente;
    @FormField('Pertenece_a_grupo_BAL', [''])
    Pertenece_a_grupo_BAL = null;
    Pertenece_a_grupo_BAL_Respuesta: Respuesta;
    @FormField('Tipo_de_Cliente', [''])
    Tipo_de_Cliente = null;
    Tipo_de_Cliente_Tipo_de_Cliente: Tipo_de_Cliente;
    @FormField('Vigencia_de_Contrato', [''])
    Vigencia_de_Contrato = '';
    @FormField('Cuota_de_mantenimiento', [''])
    Cuota_de_mantenimiento = null;
    @FormField('Costo_de_Hora_Rampa', [''])
    Costo_de_Hora_Rampa = null;
    @FormField('Costos_Hora_Tecnico', [''])
    Costos_Hora_Tecnico = null;
    @FormField('Contrato', [''])
    Contrato = null;
    @FormField('ContratoFile', [''])
    ContratoFile: FileInput = null;
    @FormField('Part_en_div_por_tramo', [false])
    Part_en_div_por_tramo = false;

     @FormField('Clientes', [''])
     Clientes: Cliente[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

