import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Miscelaneas } from './Tipo_de_Miscelaneas';
import { Tipo_de_Transporte } from './Tipo_de_Transporte';
import { Servicios_Aduanales } from './Servicios_Aduanales';
import { Gestion_de_Importacion } from './Gestion_de_Importacion';


export class Costos_de_Importacion extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Miscelaneas', [''])
    Miscelaneas = null;
    Miscelaneas_Tipo_de_Miscelaneas: Tipo_de_Miscelaneas;
    @FormField('No__items_asociados', [0])
    No__items_asociados = null;
    @FormField('Transporte', [''])
    Transporte = null;
    Transporte_Tipo_de_Transporte: Tipo_de_Transporte;
    @FormField('Costo_flete_', [0.00])
    Costo_flete_ = null;
    @FormField('Tipo_de_Cambio_T', [''])
    Tipo_de_Cambio_T = null;
    @FormField('No__de_Factura_T', [''])
    No__de_Factura_T = '';
    @FormField('Fecha_de_Factura_T', [''])
    Fecha_de_Factura_T = '';
    @FormField('Servicios_Aduanales', [''])
    Servicios_Aduanales = null;
    Servicios_Aduanales_Servicios_Aduanales: Servicios_Aduanales;
    @FormField('Costo_Servicios_', [0.00])
    Costo_Servicios_ = null;
    @FormField('Tipo_de_Cambio_SA', [''])
    Tipo_de_Cambio_SA = null;
    @FormField('No__de_Factura_SA', [''])
    No__de_Factura_SA = '';
    @FormField('Fecha_de_Factura_SA', [''])
    Fecha_de_Factura_SA = '';
    @FormField('Impuestos_Aduanales', [''])
    Impuestos_Aduanales = '';
    @FormField('Costo_Impuesto_', [0.00])
    Costo_Impuesto_ = null;
    @FormField('Tipo_de_Cambio_IA', [''])
    Tipo_de_Cambio_IA = null;
    @FormField('No__de_Factura_IA', [''])
    No__de_Factura_IA = '';
    @FormField('No__de_Factura_IA2', [''])
    No__de_Factura_IA2 = '';
    @FormField('Clave_de_Pedimento', [''])
    Clave_de_Pedimento = '';
    @FormField('No__de_Pedimento', [0])
    No__de_Pedimento = null;
    @FormField('No__de_Guia', [0])
    No__de_Guia = null;
    @FormField('FolioGestionIportacion', [''])
    FolioGestionIportacion = null;
    FolioGestionIportacion_Gestion_de_Importacion: Gestion_de_Importacion;
    @FormField('FolioCostosImportacion', [''])
    FolioCostosImportacion = '';

    @FormField('Costos_de_Importacions', [''])
    Costos_de_Importacions: Costos_de_Importacion[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

