import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Partes } from './Partes';
import { Catalogo_servicios } from './Catalogo_servicios';
import { Listado_de_Materiales } from './Listado_de_Materiales';
import { Herramientas } from './Herramientas';
import { Unidad } from './Unidad';


export class Detalle_Solicitud_de_Cotizacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_de_Parte', [''])
    No_de_Parte = null;
    No_de_Parte_Partes: Partes;
    @FormField('N_Servicio_Descripcion', [''])
    N_Servicio_Descripcion = null;
    N_Servicio_Descripcion_Catalogo_servicios: Catalogo_servicios;
    @FormField('Materiales_Codigo_Descripcion', [''])
    Materiales_Codigo_Descripcion = null;
    Materiales_Codigo_Descripcion_Listado_de_Materiales: Listado_de_Materiales;
    @FormField('Herramientas_Codigo_Descripcion', [''])
    Herramientas_Codigo_Descripcion = null;
    Herramientas_Codigo_Descripcion_Herramientas: Herramientas;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Condicion', [''])
    Condicion = '';
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;

     @FormField('Detalle_Solicitud_de_Cotizacions', [''])
     Detalle_Solicitud_de_Cotizacions: Detalle_Solicitud_de_Cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

