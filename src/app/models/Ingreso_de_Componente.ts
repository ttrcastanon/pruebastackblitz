import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Piezas } from './Piezas';
import { Tipos_de_Origen_del_Componente } from './Tipos_de_Origen_del_Componente';
import { Estatus_Parte_Asociada_al_Componente } from './Estatus_Parte_Asociada_al_Componente';
import { Tipo_de_Posicion_de_Piezas } from './Tipo_de_Posicion_de_Piezas';


export class Ingreso_de_Componente  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('N_Parte', [''])
    N_Parte = null;
    N_Parte_Piezas: Piezas;
    @FormField('Descripcion', [''])
    Descripcion = null;
    Descripcion_Piezas: Piezas;
    @FormField('Origen_del_Componente', [''])
    Origen_del_Componente = null;
    Origen_del_Componente_Tipos_de_Origen_del_Componente: Tipos_de_Origen_del_Componente;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Parte_Asociada_al_Componente: Estatus_Parte_Asociada_al_Componente;
    @FormField('N_de_Serie', [''])
    N_de_Serie = null;
    N_de_Serie_Piezas: Piezas;
    @FormField('Posicion_de_la_pieza', [''])
    Posicion_de_la_pieza = null;
    Posicion_de_la_pieza_Tipo_de_Posicion_de_Piezas: Tipo_de_Posicion_de_Piezas;
    @FormField('Fecha_de_Fabricacion', [''])
    Fecha_de_Fabricacion = '';
    @FormField('Fecha_de_Instalacion', [''])
    Fecha_de_Instalacion = '';
    @FormField('Fecha_Reparacion', [''])
    Fecha_Reparacion = '';
    @FormField('Horas_acumuladas_parte', [0])
    Horas_acumuladas_parte = null;
    @FormField('Ciclos_acumulados_parte', [0])
    Ciclos_acumulados_parte = null;
    @FormField('Horas_Acumuladas_Aeronave', [0])
    Horas_Acumuladas_Aeronave = null;
    @FormField('Ciclos_Acumulados_Aeronave', [0])
    Ciclos_Acumulados_Aeronave = null;
    @FormField('N_OT', [''])
    N_OT = '';
    @FormField('N_Reporte', [''])
    N_Reporte = '';
    @FormField('Alerta_en_horas_acumuladas', [''])
    Alerta_en_horas_acumuladas = '';
    @FormField('Alerta_en_ciclos_acumulados', [''])
    Alerta_en_ciclos_acumulados = '';

     @FormField('Ingreso_de_Componentes', [''])
     Ingreso_de_Componentes: Ingreso_de_Componente[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

