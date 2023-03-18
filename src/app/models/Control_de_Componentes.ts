import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Modulo_de_Mantenimiento } from './Modulo_de_Mantenimiento';
import { Modelos } from './Modelos';
import { Codigo_Computarizado } from './Codigo_Computarizado';
import { Aeronave } from './Aeronave';
import { Catalogo_codigo_ATA } from './Catalogo_codigo_ATA';
import { Estatus_de_componente } from './Estatus_de_componente';
import { Detalle_Parte_Asociada_Componentes } from './Detalle_Parte_Asociada_Componentes';
import { Clasificacion_de_aeronavegabilidad } from './Clasificacion_de_aeronavegabilidad';
import { Detalle_Servicios_Asociados_Componentes } from './Detalle_Servicios_Asociados_Componentes';


export class Control_de_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Id_Mantenimiento', [''])
    Id_Mantenimiento = null;
    Id_Mantenimiento_Modulo_de_Mantenimiento: Modulo_de_Mantenimiento;
    @FormField('Modelo_de_aeronave', [''])
    Modelo_de_aeronave = null;
    Modelo_de_aeronave_Modelos: Modelos;
    @FormField('Codigo_computarizado', [''])
    Codigo_computarizado = null;
    Codigo_computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Numero_de_serie', [''])
    Numero_de_serie = null;
    Numero_de_serie_Aeronave: Aeronave;
    @FormField('Capitulo_en_el_manual', [''])
    Capitulo_en_el_manual = '';
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = null;
    Codigo_ATA_Catalogo_codigo_ATA: Catalogo_codigo_ATA;
    @FormField('Descripcion_de_actividad', [''])
    Descripcion_de_actividad = '';
    @FormField('Estatus_de_componente', [''])
    Estatus_de_componente = null;
    Estatus_de_componente_Estatus_de_componente: Estatus_de_componente;
    @FormField('Tiempo_de_ejecucion', [''])
    Tiempo_de_ejecucion = '';
    @FormField('Velocidad_en_nudos', [''])
    Velocidad_en_nudos = '';
    @FormField('Color_de_la_cubierta', [''])
    Color_de_la_cubierta = '';
    @FormField('Color_de_la_aeronave', [''])
    Color_de_la_aeronave = '';
    @FormField('Detalle_Parte_Asociada_ComponentesItems', [], Detalle_Parte_Asociada_Componentes,  true)
    Detalle_Parte_Asociada_ComponentesItems: FormArray;

    @FormField('Clasificacion_de_aeronavegabilidad', [''])
    Clasificacion_de_aeronavegabilidad = null;
    Clasificacion_de_aeronavegabilidad_Clasificacion_de_aeronavegabilidad: Clasificacion_de_aeronavegabilidad;
    @FormField('Detalle_Servicios_Asociados_ComponentesItems', [], Detalle_Servicios_Asociados_Componentes,  true)
    Detalle_Servicios_Asociados_ComponentesItems: FormArray;

    @FormField('Instrucciones', [''])
    Instrucciones = null;
    @FormField('InstruccionesFile', [''])
    InstruccionesFile: FileInput = null;

     @FormField('Control_de_Componentess', [''])
     Control_de_Componentess: Control_de_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

