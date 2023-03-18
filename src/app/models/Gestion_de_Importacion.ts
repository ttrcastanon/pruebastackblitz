import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Transporte } from './Tipo_de_Transporte';
import { Tipo_de_Miscelaneas } from './Tipo_de_Miscelaneas';
import { Servicios_Aduanales } from './Servicios_Aduanales';


export class Gestion_de_Importacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__Items_asociados', [0])
    No__Items_asociados = null;
    @FormField('Transporte', [''])
    Transporte = null;
    Transporte_Tipo_de_Transporte: Tipo_de_Transporte;
    @FormField('Clave_de_Pedimento', [''])
    Clave_de_Pedimento = '';
    @FormField('No__de_Pedimento', [0])
    No__de_Pedimento = null;
    @FormField('Miscelanea', [''])
    Miscelanea = null;
    Miscelanea_Tipo_de_Miscelaneas: Tipo_de_Miscelaneas;
    @FormField('No__de_Guia', [0])
    No__de_Guia = null;
    @FormField('Servicio_Aduanales', [''])
    Servicio_Aduanales = null;
    Servicio_Aduanales_Servicios_Aduanales: Servicios_Aduanales;
    @FormField('FolioGestiondeImportacion', [''])
    FolioGestiondeImportacion = '';

     @FormField('Gestion_de_Importacions', [''])
     Gestion_de_Importacions: Gestion_de_Importacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

