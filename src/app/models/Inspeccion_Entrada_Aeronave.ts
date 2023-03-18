import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Crear_Reporte } from './Crear_Reporte';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Spartan_User } from './Spartan_User';
import { Modelos } from './Modelos';
import { Cliente } from './Cliente';
import { Respuesta } from './Respuesta';
import { Detalle_Inspeccion_Entrada_Aeronave } from './Detalle_Inspeccion_Entrada_Aeronave';


export class Inspeccion_Entrada_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Reporte', [''])
    Reporte = null;
    Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('N_Orden_de_Trabajo', [''])
    N_Orden_de_Trabajo = null;
    N_Orden_de_Trabajo_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Fecha_de_Entrega', [''])
    Fecha_de_Entrega = '';
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Aeronave', [''])
    Aeronave = '';
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Numero_de_Serie', [''])
    Numero_de_Serie = '';
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Se_realizo_evidencia_filmografica', [''])
    Se_realizo_evidencia_filmografica = null;
    Se_realizo_evidencia_filmografica_Respuesta: Respuesta;
    @FormField('Cant__Combustible_en_la_recepcion', [''])
    Cant__Combustible_en_la_recepcion = '';
    @FormField('Razon_de_ingreso', [''])
    Razon_de_ingreso = '';
    @FormField('Detalle_Inspeccion_Entrada_AeronaveItems', [], Detalle_Inspeccion_Entrada_Aeronave,  true)
    Detalle_Inspeccion_Entrada_AeronaveItems: FormArray;


     @FormField('Inspeccion_Entrada_Aeronaves', [''])
     Inspeccion_Entrada_Aeronaves: Inspeccion_Entrada_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

