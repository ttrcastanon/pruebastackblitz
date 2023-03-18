import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_Requerido } from './Estatus_de_Requerido';
import { Spartan_User } from './Spartan_User';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Crear_Reporte } from './Crear_Reporte';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';


export class Salida_en_Almacen_de_partes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__de_Parte___Descripcion', [''])
    No__de_Parte___Descripcion = '';
    @FormField('Se_mantiene_el_No__de_Parte', [''])
    Se_mantiene_el_No__de_Parte = null;
    Se_mantiene_el_No__de_Parte_Estatus_de_Requerido: Estatus_de_Requerido;
    @FormField('No__de_parte_nuevo', [''])
    No__de_parte_nuevo = '';
    @FormField('No__de_serie', [''])
    No__de_serie = '';
    @FormField('No__de_lote', [''])
    No__de_lote = '';
    @FormField('Hora_acumuladas', [''])
    Hora_acumuladas = null;
    @FormField('Ciclos_acumulados', [0])
    Ciclos_acumulados = null;
    @FormField('Fecha_de_Vencimiento', [''])
    Fecha_de_Vencimiento = '';
    @FormField('Ubicacion', [''])
    Ubicacion = '';
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('No__de_OT', [''])
    No__de_OT = null;
    No__de_OT_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('No__de_Reporte', [''])
    No__de_Reporte = null;
    No__de_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('IdAsignacionPartes', [''])
    IdAsignacionPartes = '';

     @FormField('Salida_en_Almacen_de_partess', [''])
     Salida_en_Almacen_de_partess: Salida_en_Almacen_de_partes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

