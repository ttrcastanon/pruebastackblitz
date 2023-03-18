import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Modelos } from './Modelos';
import { Propietarios } from './Propietarios';
import { Fabricante } from './Fabricante';
import { Cliente } from './Cliente';
import { Origen_de_Aeronave } from './Origen_de_Aeronave';
import { Estatus_Aeronave } from './Estatus_Aeronave';
import { detalle_de_imagenes_de_aeronave } from './detalle_de_imagenes_de_aeronave';
import { Nivel_de_Ruido } from './Nivel_de_Ruido';
import { Turbulencia_de_Estela } from './Turbulencia_de_Estela';
import { Equipo_de_Navegacion } from './Equipo_de_Navegacion';
import { Tipo_de_Ala } from './Tipo_de_Ala';
import { Detalle_Motores_de_Aeronave } from './Detalle_Motores_de_Aeronave';
import { Tipo_de_Bitacora_de_Aeronave } from './Tipo_de_Bitacora_de_Aeronave';
import { Detalle_Seguros_Asociados_a } from './Detalle_Seguros_Asociados_a';


export class Aeronave  extends BaseView {
    @FormField('Matricula', [''])
    Matricula = '';
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Propietario', [''])
    Propietario = null;
    Propietario_Propietarios: Propietarios;
    @FormField('Fabricante', [''])
    Fabricante = null;
    Fabricante_Fabricante: Fabricante;
    @FormField('Numero_de_Serie', [''])
    Numero_de_Serie = '';
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Ano_de_Fabricacion', [0])
    Ano_de_Fabricacion = null;
    @FormField('Origen_de_Aeronave', [''])
    Origen_de_Aeronave = null;
    Origen_de_Aeronave_Origen_de_Aeronave: Origen_de_Aeronave;
    @FormField('Propia', [false])
    Propia = false;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Aeronave: Estatus_Aeronave;
    @FormField('Operaciones', [false])
    Operaciones = false;
    @FormField('Mantenimiento', [false])
    Mantenimiento = false;
    @FormField('detalle_de_imagenes_de_aeronaveItems', [], detalle_de_imagenes_de_aeronave,  true)
    detalle_de_imagenes_de_aeronaveItems: FormArray;

    @FormField('Capacidad_de_pasajeros', [0])
    Capacidad_de_pasajeros = null;
    @FormField('Nivel_de_ruido', [''])
    Nivel_de_ruido = null;
    Nivel_de_ruido_Nivel_de_Ruido: Nivel_de_Ruido;
    @FormField('Turbulencia', [''])
    Turbulencia = null;
    Turbulencia_Turbulencia_de_Estela: Turbulencia_de_Estela;
    @FormField('Equipo_de_navegacion', [''])
    Equipo_de_navegacion = null;
    Equipo_de_navegacion_Equipo_de_Navegacion: Equipo_de_Navegacion;
    @FormField('UHV', [false])
    UHV = false;
    @FormField('VHF', [false])
    VHF = false;
    @FormField('ELT', [false])
    ELT = false;
    @FormField('Desierto', [false])
    Desierto = false;
    @FormField('Polar', [false])
    Polar = false;
    @FormField('Selva', [false])
    Selva = false;
    @FormField('Maritimo', [false])
    Maritimo = false;
    @FormField('Chalecos_salvavidas', [0])
    Chalecos_salvavidas = null;
    @FormField('Numero_de_lanchas_salvavidas', [0])
    Numero_de_lanchas_salvavidas = null;
    @FormField('Capacidad', [0])
    Capacidad = null;
    @FormField('Color_de_la_aeronave', [''])
    Color_de_la_aeronave = '';
    @FormField('Color_cubierta_de_los_botes', [''])
    Color_cubierta_de_los_botes = '';
    @FormField('Velocidad', [0])
    Velocidad = null;
    @FormField('Tipo_de_Ala', [''])
    Tipo_de_Ala = null;
    Tipo_de_Ala_Tipo_de_Ala: Tipo_de_Ala;
    @FormField('UPA', [''])
    UPA = '';
    @FormField('UPA_MODELO', [''])
    UPA_MODELO = '';
    @FormField('UPA_SERIE', [''])
    UPA_SERIE = '';
    @FormField('Detalle_Motores_de_AeronaveItems', [], Detalle_Motores_de_Aeronave,  true)
    Detalle_Motores_de_AeronaveItems: FormArray;

    @FormField('Ciclos_iniciales', [0])
    Ciclos_iniciales = null;
    @FormField('Ciclos_actuales', [0])
    Ciclos_actuales = null;
    @FormField('Horas_iniciales', [''])
    Horas_iniciales = '';
    @FormField('Horas_actuales', [''])
    Horas_actuales = '';
    @FormField('Inicio_de_operaciones', [''])
    Inicio_de_operaciones = '';
    @FormField('Bitacora', [''])
    Bitacora = null;
    Bitacora_Tipo_de_Bitacora_de_Aeronave: Tipo_de_Bitacora_de_Aeronave;
    @FormField('Envergadura', [''])
    Envergadura = null;
    @FormField('Cuota_SENEAM', [''])
    Cuota_SENEAM = null;

    @FormField('Detalle_Seguros_Asociados_aItems', [], Detalle_Seguros_Asociados_a,  true)
    Detalle_Seguros_Asociados_aItems: FormArray;


     @FormField('Aeronaves', [''])
     Aeronaves: Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

