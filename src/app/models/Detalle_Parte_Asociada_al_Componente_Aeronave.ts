import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Codigo_Computarizado } from './Codigo_Computarizado';
import { Catalogo_codigo_ATA } from './Catalogo_codigo_ATA';
import { Tipos_de_Origen_del_Componente } from './Tipos_de_Origen_del_Componente';


export class Detalle_Parte_Asociada_al_Componente_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdControl = 0;
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = null;
    Codigo_Computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = null;
    Codigo_ATA_Catalogo_codigo_ATA: Catalogo_codigo_ATA;
    @FormField('N_Parte', [''])
    N_Parte = '';
    @FormField('Descripcion_de_la_parte', [''])
    Descripcion_de_la_parte = '';
    @FormField('Modelo', [''])
    Modelo = '';
    @FormField('Origen_del_componente', [''])
    Origen_del_componente = null;
    Origen_del_componente_Tipos_de_Origen_del_Componente: Tipos_de_Origen_del_Componente;
    @FormField('N_de_Serie', [''])
    N_de_Serie = '';
    @FormField('Posicion_de_la_pieza', [''])
    Posicion_de_la_pieza = '';
    @FormField('Fecha_de_fabricacion', [''])
    Fecha_de_fabricacion = '';
    @FormField('Fecha_de_instalacion', [''])
    Fecha_de_instalacion = '';
    @FormField('Fecha_de_reparacion', [''])
    Fecha_de_reparacion = '';
    @FormField('Horas_acumuladas_parte', [0])
    Horas_acumuladas_parte = null;
    @FormField('Dias_acumulados_parte', [0])
    Dias_acumulados_parte = null;
    @FormField('Ciclos_acumulados_parte', [0])
    Ciclos_acumulados_parte = null;
    @FormField('Horas_acumuladas_aeronave', [0])
    Horas_acumuladas_aeronave = null;
    @FormField('Ciclos_acumulados_aeronave', [0])
    Ciclos_acumulados_aeronave = null;
    @FormField('Limite_de_meses', [''])
    Limite_de_meses = '';
    @FormField('Limite_de_horas', [''])
    Limite_de_horas = '';
    @FormField('Limite_de_ciclos', [''])
    Limite_de_ciclos = '';
    @FormField('N_OT', [''])
    N_OT = '';
    @FormField('N_Reporte', [''])
    N_Reporte = '';
    @FormField('HorasInicialesAeronave', [0])
    HorasInicialesAeronave = null;
    @FormField('CiclosInicialesAeronave', [0])
    CiclosInicialesAeronave = null;
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

     @FormField('Detalle_Parte_Asociada_al_Componente_Aeronaves', [''])
     Detalle_Parte_Asociada_al_Componente_Aeronaves: Detalle_Parte_Asociada_al_Componente_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

