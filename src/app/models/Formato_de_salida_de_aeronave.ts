import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Cliente } from './Cliente';
import { Spartan_User } from './Spartan_User';
import { Detalle_Inspeccion_Salida } from './Detalle_Inspeccion_Salida';


export class Formato_de_salida_de_aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Orden_de_Trabajo', [''])
    Orden_de_Trabajo = null;
    Orden_de_Trabajo_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Fecha_de_Inspeccion', [''])
    Fecha_de_Inspeccion = '';
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Numero_de_serie', [''])
    Numero_de_serie = '';
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Usuario_que_registra', [''])
    Usuario_que_registra = null;
    Usuario_que_registra_Spartan_User: Spartan_User;
    @FormField('Rol_de_usuario', [''])
    Rol_de_usuario = '';
    @FormField('Hora', [''])
    Hora = '';
    @FormField('Prevuelo_Efectuado', [false])
    Prevuelo_Efectuado = false;
    @FormField('Liberado_despues_de_reparacion_mayor', [false])
    Liberado_despues_de_reparacion_mayor = false;
    @FormField('Liberado_despues_de_inspeccion', [false])
    Liberado_despues_de_inspeccion = false;
    @FormField('Liberado_despues_de_modificacion_mayor', [false])
    Liberado_despues_de_modificacion_mayor = false;
    @FormField('Liberado_despues_de_trabajos_menores', [false])
    Liberado_despues_de_trabajos_menores = false;
    @FormField('Tipo_de_inspeccion', [''])
    Tipo_de_inspeccion = '';
    @FormField('Detalle_Inspeccion_SalidaItems', [], Detalle_Inspeccion_Salida,  true)
    Detalle_Inspeccion_SalidaItems: FormArray;

    @FormField('Combustible_LH', [''])
    Combustible_LH = '';
    @FormField('Combustible_RH', [''])
    Combustible_RH = '';
    @FormField('Regresar_a_servicio', [false])
    Regresar_a_servicio = false;
    @FormField('Vuelo_de_evaluacion', [false])
    Vuelo_de_evaluacion = false;
    @FormField('Salida', [false])
    Salida = false;

     @FormField('Formato_de_salida_de_aeronaves', [''])
     Formato_de_salida_de_aeronaves: Formato_de_salida_de_aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

