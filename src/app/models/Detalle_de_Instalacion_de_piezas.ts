import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Detalle_Parte_Asociada_al_Componente_Aeronave } from './Detalle_Parte_Asociada_al_Componente_Aeronave';
import { Tipos_de_Origen_del_Componente } from './Tipos_de_Origen_del_Componente';
import { Spartan_User } from './Spartan_User';
import { Catalogo_Tipo_de_Vencimiento } from './Catalogo_Tipo_de_Vencimiento';
import { Estatus_de_remocion } from './Estatus_de_remocion';


export class Detalle_de_Instalacion_de_piezas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    id_Instalacion = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('N_Parte', [''])
    N_Parte = null;
    N_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave: Detalle_Parte_Asociada_al_Componente_Aeronave;
    @FormField('N_de_serie', [''])
    N_de_serie = '';
    @FormField('Modelo', [''])
    Modelo = '';
    @FormField('Posicion', [''])
    Posicion = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Tipos_de_Origen_del_Componente: Tipos_de_Origen_del_Componente;
    @FormField('Horas_acumuladas_parte', [0])
    Horas_acumuladas_parte = null;
    @FormField('Ciclos_acumulados_parte', [0])
    Ciclos_acumulados_parte = null;
    @FormField('Fecha_de_Fabricacion', [''])
    Fecha_de_Fabricacion = '';
    @FormField('Meses_Acumulados_Parte', [0])
    Meses_Acumulados_Parte = null;
    @FormField('Fecha_de_Reparacion', [''])
    Fecha_de_Reparacion = '';
    @FormField('Fecha_de_Instalacion', [''])
    Fecha_de_Instalacion = '';
    @FormField('Encargado_de_la_instalacion', [''])
    Encargado_de_la_instalacion = null;
    Encargado_de_la_instalacion_Spartan_User: Spartan_User;
    @FormField('Tipo_de_Vencimiento', [''])
    Tipo_de_Vencimiento = null;
    Tipo_de_Vencimiento_Catalogo_Tipo_de_Vencimiento: Catalogo_Tipo_de_Vencimiento;
    @FormField('Limite_de_Horas', [0])
    Limite_de_Horas = null;
    @FormField('Limite_de_Ciclos', [0])
    Limite_de_Ciclos = null;
    @FormField('Limite_de_Meses', [0])
    Limite_de_Meses = null;
    @FormField('Estatus_de_remocion', [''])
    Estatus_de_remocion = null;
    Estatus_de_remocion_Estatus_de_remocion: Estatus_de_remocion;

     @FormField('Detalle_de_Instalacion_de_piezass', [''])
     Detalle_de_Instalacion_de_piezass: Detalle_de_Instalacion_de_piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

