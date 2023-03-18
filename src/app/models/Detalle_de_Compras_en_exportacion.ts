import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Gestion_de_Exportacion } from './Gestion_de_Exportacion';


export class Detalle_de_Compras_en_exportacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_Orden_de_Compra', [''])
    No_Orden_de_Compra = null;
    No_Orden_de_Compra_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No_de_Parte___Descripcion', [''])
    No_de_Parte___Descripcion = '';
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('No__de_Pedimento_Export_', [0])
    No__de_Pedimento_Export_ = null;
    @FormField('Clave_de_Pedimento_Export_', [''])
    Clave_de_Pedimento_Export_ = '';
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('No__Factura', [''])
    No__Factura = '';
    @FormField('FolioGestionExportacion', [''])
    FolioGestionExportacion = null;
    FolioGestionExportacion_Gestion_de_Exportacion: Gestion_de_Exportacion;
    Compras_en_proceso_de_Exportacion = 0;

     @FormField('Detalle_de_Compras_en_exportacions', [''])
     Detalle_de_Compras_en_exportacions: Detalle_de_Compras_en_exportacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

