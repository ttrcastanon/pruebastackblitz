import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pais } from './Pais';
import { Estado } from './Estado';
import { Ciudad } from './Ciudad';
import { Tipo_de_Aeropuerto } from './Tipo_de_Aeropuerto';
import { Detalle_Pista_de_Aeropuerto } from './Detalle_Pista_de_Aeropuerto';
import { Detalle_FBO } from './Detalle_FBO';
import { Detalle_Hoteles } from './Detalle_Hoteles';
import { Detalle_Comisariatos } from './Detalle_Comisariatos';
import { Detalle_Transportes } from './Detalle_Transportes';


export class Aeropuertos  extends BaseView {
    @FormField('Aeropuerto_ID', [0])
    Aeropuerto_ID = 0;
    @FormField('ICAO', [''])
    ICAO = '';
    @FormField('IATA', [''])
    IATA = '';
    @FormField('FAA', [''])
    FAA = '';
    @FormField('Nombre', [''])
    Nombre = '';
    @FormField('Pais', [''])
    Pais = null;
    Pais_Pais: Pais;
    @FormField('Estado', [''])
    Estado = null;
    Estado_Estado: Estado;
    @FormField('Ciudad', [''])
    Ciudad = null;
    Ciudad_Ciudad: Ciudad;
    @FormField('Horario_de_operaciones', [''])
    Horario_de_operaciones = '';
    @FormField('Latitud', [''])
    Latitud = '';
    @FormField('Longitud', [''])
    Longitud = '';
    @FormField('Elevacion_pies', [0])
    Elevacion_pies = null;
    @FormField('Variacion', [''])
    Variacion = '';
    @FormField('Tipo_de_Aeropuerto', [''])
    Tipo_de_Aeropuerto = null;
    Tipo_de_Aeropuerto_Tipo_de_Aeropuerto: Tipo_de_Aeropuerto;
    @FormField('Ciudad_mas_cercana', [''])
    Ciudad_mas_cercana = null;
    Ciudad_mas_cercana_Ciudad: Ciudad;
    @FormField('Distancia_en_KM', [''])
    Distancia_en_KM = null;
    @FormField('Aeropuerto_Controlado', [false])
    Aeropuerto_Controlado = false;
    @FormField('Comandante_Honorario', [''])
    Comandante_Honorario = null;
    @FormField('Detalle_Pista_de_AeropuertoItems', [], Detalle_Pista_de_Aeropuerto,  true)
    Detalle_Pista_de_AeropuertoItems: FormArray;

    @FormField('UTC_Estandar', [''])
    UTC_Estandar = '';
    @FormField('UTC_Estandar_Inicio', [''])
    UTC_Estandar_Inicio = '';
    @FormField('UTC_Estandar_Fin', [''])
    UTC_Estandar_Fin = '';
    @FormField('UTC_DLTS', [''])
    UTC_DLTS = '';
    @FormField('UTC_DLTS_Inicio', [''])
    UTC_DLTS_Inicio = '';
    @FormField('UTC_DLTS_Fin', [''])
    UTC_DLTS_Fin = '';
    @FormField('UTC__Amanecer', [''])
    UTC__Amanecer = '';
    @FormField('UTC__Atardecer', [''])
    UTC__Atardecer = '';
    @FormField('Local_Amanecer', [''])
    Local_Amanecer = '';
    @FormField('Local_Atardecer', [''])
    Local_Atardecer = '';
    @FormField('TWR', [''])
    TWR = null;
    @FormField('GND', [''])
    GND = null;
    @FormField('UNICOM', [''])
    UNICOM = '';
    @FormField('CARDEL_1', [''])
    CARDEL_1 = '';
    @FormField('CARDEL_2', [''])
    CARDEL_2 = '';
    @FormField('APPR', [''])
    APPR = null;
    @FormField('DEP', [''])
    DEP = null;
    @FormField('ATIS', [''])
    ATIS = '';
    @FormField('ATIS_Phone', [''])
    ATIS_Phone = '';
    @FormField('ASOS', [''])
    ASOS = '';
    @FormField('ASOS_Phone', [''])
    ASOS_Phone = '';
    @FormField('AWOS', [''])
    AWOS = '';
    @FormField('AWOS_Phone', [''])
    AWOS_Phone = '';
    @FormField('AWOS_Type', [''])
    AWOS_Type = '';
    @FormField('Codigo_de_area___Lada', [''])
    Codigo_de_area___Lada = '';
    @FormField('Administracion_Aeropuerto', [''])
    Administracion_Aeropuerto = '';
    @FormField('Comandancia', [''])
    Comandancia = '';
    @FormField('Despacho', [''])
    Despacho = '';
    @FormField('Torre_de_Control', [''])
    Torre_de_Control = '';
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Detalle_FBOItems', [], Detalle_FBO,  true)
    Detalle_FBOItems: FormArray;

    @FormField('Detalle_HotelesItems', [], Detalle_Hoteles,  true)
    Detalle_HotelesItems: FormArray;

    @FormField('Detalle_ComisariatosItems', [], Detalle_Comisariatos,  true)
    Detalle_ComisariatosItems: FormArray;

    @FormField('Detalle_TransportesItems', [], Detalle_Transportes,  true)
    Detalle_TransportesItems: FormArray;

    @FormField('Notas', [''])
    Notas = '';
    @FormField('ICAO_IATA', [''])
    ICAO_IATA = '';

     @FormField('Aeropuertoss', [''])
     Aeropuertoss: Aeropuertos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

