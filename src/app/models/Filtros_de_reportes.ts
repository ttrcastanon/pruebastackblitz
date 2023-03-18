import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Tipo_de_Grupo } from './Tipo_de_Grupo';
import { Cliente } from './Cliente';
import { Pasajeros } from './Pasajeros';
import { Tripulacion } from './Tripulacion';
import { Aeropuertos } from './Aeropuertos';


export class Filtros_de_reportes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Aeronaves', [''])
    Aeronaves = null;
    Aeronaves_Aeronave: Aeronave;
    @FormField('Imprimir_solo_aeronaves_activas', [false])
    Imprimir_solo_aeronaves_activas = false;
    @FormField('Mostrar_Aeronave', [''])
    Mostrar_Aeronave = null;
    Mostrar_Aeronave_Tipo_de_Grupo: Tipo_de_Grupo;
    @FormField('Clientes', [''])
    Clientes = null;
    Clientes_Cliente: Cliente;
    @FormField('Imprimir_solo_clientes_activos', [false])
    Imprimir_solo_clientes_activos = false;
    @FormField('Mostrar_Cliente', [''])
    Mostrar_Cliente = null;
    Mostrar_Cliente_Tipo_de_Grupo: Tipo_de_Grupo;
    @FormField('Pasajeros', [''])
    Pasajeros = null;
    Pasajeros_Pasajeros: Pasajeros;
    @FormField('Imprimir_solo_pasajeros_activos', [false])
    Imprimir_solo_pasajeros_activos = false;
    @FormField('Mostrar_Pasajero', [''])
    Mostrar_Pasajero = null;
    Mostrar_Pasajero_Tipo_de_Grupo: Tipo_de_Grupo;
    @FormField('Pilotos', [''])
    Pilotos = null;
    Pilotos_Tripulacion: Tripulacion;
    @FormField('Imprimir_solo_pilotos_activos', [false])
    Imprimir_solo_pilotos_activos = false;
    @FormField('Mostrar_Piloto', [''])
    Mostrar_Piloto = null;
    Mostrar_Piloto_Tipo_de_Grupo: Tipo_de_Grupo;
    @FormField('Vuelos_como_capitan_o_primer_oficial', [false])
    Vuelos_como_capitan_o_primer_oficial = false;
    @FormField('Aeropuerto', [''])
    Aeropuerto = null;
    Aeropuerto_Aeropuertos: Aeropuertos;
    @FormField('Aeropuerto_Destino', [''])
    Aeropuerto_Destino = null;
    Aeropuerto_Destino_Aeropuertos: Aeropuertos;

     @FormField('Filtros_de_reportess', [''])
     Filtros_de_reportess: Filtros_de_reportes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

