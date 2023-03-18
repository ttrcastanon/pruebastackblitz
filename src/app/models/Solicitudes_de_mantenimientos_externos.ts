import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Crear_Reporte } from './Crear_Reporte';
import { Propietarios } from './Propietarios';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';


export class Solicitudes_de_mantenimientos_externos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('N_Reporte', [''])
    N_Reporte = null;
    N_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Propietario', [''])
    Propietario = null;
    Propietario_Propietarios: Propietarios;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('N_Servicio', [''])
    N_Servicio = '';
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Costo_pieza', [''])
    Costo_pieza = null;
    @FormField('Costo_total', [''])
    Costo_total = null;
    @FormField('Nuevo_costo', [''])
    Nuevo_costo = null;
    @FormField('Nuevo_monto_negociado', [''])
    Nuevo_monto_negociado = null;
    @FormField('Observaciones', [''])
    Observaciones = '';

     @FormField('Solicitudes_de_mantenimientos_externoss', [''])
     Solicitudes_de_mantenimientos_externoss: Solicitudes_de_mantenimientos_externos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

