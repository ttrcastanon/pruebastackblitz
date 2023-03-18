import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipos_de_Origen_del_Componente } from './Tipos_de_Origen_del_Componente';
import { Spartan_User } from './Spartan_User';
import { Catalogo_Tipo_de_Vencimiento } from './Catalogo_Tipo_de_Vencimiento';


export class Historial_de_Instalacion_de_partes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('N_de_parte', [''])
    N_de_parte = '';
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
    @FormField('Fecha_de_Instalacion', [''])
    Fecha_de_Instalacion = '';
    @FormField('Fecha_Reparacion', [''])
    Fecha_Reparacion = '';
    @FormField('Usuario_que_realiza_la_instalacion', [''])
    Usuario_que_realiza_la_instalacion = null;
    Usuario_que_realiza_la_instalacion_Spartan_User: Spartan_User;
    @FormField('Meses_acumulados_parte', [0])
    Meses_acumulados_parte = null;
    @FormField('Tipo_de_vencimiento', [''])
    Tipo_de_vencimiento = null;
    Tipo_de_vencimiento_Catalogo_Tipo_de_Vencimiento: Catalogo_Tipo_de_Vencimiento;
    IdControl = 0;

     @FormField('Historial_de_Instalacion_de_partess', [''])
     Historial_de_Instalacion_de_partess: Historial_de_Instalacion_de_partes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

