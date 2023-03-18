import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Procedencia } from './Procedencia';
import { Tipo_de_urgencia } from './Tipo_de_urgencia';
import { Catalogo_codigo_ATA } from './Catalogo_codigo_ATA';
import { Detalle_cargar_instrucciones } from './Detalle_cargar_instrucciones';


export class Boletines_Directivas_aeronavegatibilidad  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Aeronave', [''])
    Aeronave = null;
    Aeronave_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('N_Serie', [''])
    N_Serie = null;
    N_Serie_Aeronave: Aeronave;
    @FormField('Procedencia', [''])
    Procedencia = null;
    Procedencia_Procedencia: Procedencia;
    @FormField('Tipo', [''])
    Tipo = null;
    Tipo_Tipo_de_urgencia: Tipo_de_urgencia;
    @FormField('N_de_boletin_directiva_aeronavegabilidad', [''])
    N_de_boletin_directiva_aeronavegabilidad = '';
    @FormField('titulo_de_boletin_o_directiva', [''])
    titulo_de_boletin_o_directiva = '';
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = null;
    Codigo_ATA_Catalogo_codigo_ATA: Catalogo_codigo_ATA;
    @FormField('Fecha_de_creacion', [''])
    Fecha_de_creacion = '';
    @FormField('Crear_reporte', [false])
    Crear_reporte = false;
    @FormField('Horas', [0])
    Horas = null;
    @FormField('Dias', [0])
    Dias = null;
    @FormField('Meses', [0])
    Meses = null;
    @FormField('Ciclos', [0])
    Ciclos = null;
    @FormField('Es_recurrente', [false])
    Es_recurrente = false;
    @FormField('LimitesEnDias', [0])
    LimitesEnDias = null;
    @FormField('DiasTranscurridos', [''])
    DiasTranscurridos = null;
    @FormField('DiasFaltantes', [''])
    DiasFaltantes = null;
    @FormField('HorasFaltantes', [''])
    HorasFaltantes = null;
    @FormField('CiclosFaltantes', [''])
    CiclosFaltantes = null;
    @FormField('Estatus', [''])
    Estatus = '';
    @FormField('HorasTranscurridas', [''])
    HorasTranscurridas = null;
    @FormField('MesesTranscurridos', [''])
    MesesTranscurridos = null;
    @FormField('MesesFaltantes', [''])
    MesesFaltantes = null;
    @FormField('CiclosTranscurridos', [''])
    CiclosTranscurridos = null;
    @FormField('Detalle_cargar_instruccionesItems', [], Detalle_cargar_instrucciones,  true)
    Detalle_cargar_instruccionesItems: FormArray;


     @FormField('Boletines_Directivas_aeronavegatibilidads', [''])
     Boletines_Directivas_aeronavegatibilidads: Boletines_Directivas_aeronavegatibilidad[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

