import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Partes } from './Partes';
import { Catalogo_servicios } from './Catalogo_servicios';
import { Listado_de_Materiales } from './Listado_de_Materiales';
import { Herramientas } from './Herramientas';
import { Modelos } from './Modelos';
import { Unidad } from './Unidad';


export class Detalle_de_Generacion_de_OC  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Generacion_de_Orden_de_Compras = 0;
    @FormField('No__de_Parte', [''])
    No__de_Parte = null;
    No__de_Parte_Partes: Partes;
    @FormField('N_Servicio_Descripcion', [''])
    N_Servicio_Descripcion = null;
    N_Servicio_Descripcion_Catalogo_servicios: Catalogo_servicios;
    @FormField('Materiales_Codigo_Descripcion', [''])
    Materiales_Codigo_Descripcion = null;
    Materiales_Codigo_Descripcion_Listado_de_Materiales: Listado_de_Materiales;
    @FormField('Herramientas_Codigo_Descripcion', [''])
    Herramientas_Codigo_Descripcion = null;
    Herramientas_Codigo_Descripcion_Herramientas: Herramientas;
    @FormField('Codigo_Descripcion', [''])
    Codigo_Descripcion = '';
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;
    @FormField('Costo_Unitario', [''])
    Costo_Unitario = null;
    @FormField('Costo_Total', [''])
    Costo_Total = null;

     @FormField('Detalle_de_Generacion_de_OCs', [''])
     Detalle_de_Generacion_de_OCs: Detalle_de_Generacion_de_OC[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

