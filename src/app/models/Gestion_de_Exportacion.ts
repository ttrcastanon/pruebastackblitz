import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Servicios_Aduanales } from './Servicios_Aduanales';


export class Gestion_de_Exportacion extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Transporte', [''])
    Transporte = '';
    @FormField('Costo_Flete_', ['0.00'])
    Costo_Flete_ = '0.00';
    @FormField('Tipo_de_Cambio_Transp_', [''])
    Tipo_de_Cambio_Transp_ = null;
    @FormField('No__Factura', [0])
    No__Factura = null;
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Servicios_aduanales', [''])
    Servicios_aduanales = null;
    Servicios_aduanales_Servicios_Aduanales: Servicios_Aduanales;
    @FormField('Costo_Servicios_', ['0.00'])
    Costo_Servicios_ = '0.00';
    @FormField('Tipo_de_Cambio_Aduanales', [''])
    Tipo_de_Cambio_Aduanales = null;
    @FormField('No__Factura_SA', [0])
    No__Factura_SA = null;
    @FormField('Fecha_de_Factura_2', [''])
    Fecha_de_Factura_2 = '';
    @FormField('Impuestos_Aduanales', [0])
    Impuestos_Aduanales = null;
    @FormField('Costo_Impuestos_', ['0.00'])
    Costo_Impuestos_ = null;
    @FormField('Tipo_de_Cambio_Imp_', [''])
    Tipo_de_Cambio_Imp_ = null;
    @FormField('Clave_de_Pedimento', [''])
    Clave_de_Pedimento = '';
    @FormField('No__de_Pedimento', [0])
    No__de_Pedimento = null;
    @FormField('No__De_Guia', [0])
    No__De_Guia = null;
    @FormField('Aplicacion', [''])
    Aplicacion = '';
    @FormField('FolioExportacion', [''])
    FolioExportacion = '';

    @FormField('Gestion_de_Exportacions', [''])
    Gestion_de_Exportacions: Gestion_de_Exportacion[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

