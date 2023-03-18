import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Partes } from './Partes';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Gestion_de_Importacion } from './Gestion_de_Importacion';
import { Costos_de_Importacion } from './Costos_de_Importacion';


export class Detalle_de_Compras_de_Importacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_Orden_de_Compra', [''])
    No_Orden_de_Compra = null;
    No_Orden_de_Compra_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No_de_Parte___Descripcion', [''])
    No_de_Parte___Descripcion = null;
    No_de_Parte___Descripcion_Partes: Partes;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('No__de_Pedimento_Import_', [0])
    No__de_Pedimento_Import_ = null;
    @FormField('Clave_de_Pedimento_Import_', [''])
    Clave_de_Pedimento_Import_ = '';
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('No__Factura', [''])
    No__Factura = '';
    @FormField('Costo_', [''])
    Costo_ = null;
    @FormField('Fecha_de_Factura_T', [''])
    Fecha_de_Factura_T = '';
    @FormField('No__Factura_T', [''])
    No__Factura_T = '';
    @FormField('Costo_T_', [''])
    Costo_T_ = null;
    Compras_en_proceso_de_Importacion = 0;
    @FormField('FolioGestionIportacion', [''])
    FolioGestionIportacion = null;
    FolioGestionIportacion_Gestion_de_Importacion: Gestion_de_Importacion;
    @FormField('FolioCostosImportacion', [''])
    FolioCostosImportacion = null;
    FolioCostosImportacion_Costos_de_Importacion: Costos_de_Importacion;
    @FormField('iddetallegestionaprobacion', [0])
    iddetallegestionaprobacion = null;

     @FormField('Detalle_de_Compras_de_Importacions', [''])
     Detalle_de_Compras_de_Importacions: Detalle_de_Compras_de_Importacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

