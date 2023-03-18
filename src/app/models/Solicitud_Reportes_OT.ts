import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';


export class Solicitud_Reportes_OT  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    id_orden_de_trabajo = 0;
    @FormField('Seleccionar', [false])
    Seleccionar = false;

    @FormField('M_Reporte', [''])
    M_Reporte = '';
    @FormField('M_TipoReporte', [''])
    M_TipoReporte = '';
    @FormField('M_Descripcion', [''])
    M_Descripcion = '';
    @FormField('M_CPM', [''])
    M_CPM = '';
    @FormField('M_ATA', [''])
    M_ATA = '';
    // @FormField('M_Tecnico', [''])
    // M_Tecnico = '';
    @FormField('M_TecnicoNombre', [''])
    M_TecnicoNombre = '';


    @FormField('M_Tecnico', [''])
    M_Tecnico = null;
    M_Tecnico_Spartan_User: Spartan_User;



    @FormField('MR_TipoReporte', [''])
    MR_TipoReporte = '';
    @FormField('MR_FolioReporte', [''])
    MR_FolioReporte = '';
    @FormField('MR_DescripcionReporte', [''])
    MR_DescripcionReporte = '';
    @FormField('MR_Matricula', [''])
    MR_Matricula = '';
    @FormField('MR_Modelo', [''])
    MR_Modelo = '';
    @FormField('MR_CodigoComputarizado', [''])
    MR_CodigoComputarizado = '';
    @FormField('MR_ATA', [''])
    MR_ATA = '';
    @FormField('MR_OrigenReporte', [''])
    MR_OrigenReporte = '';

     @FormField('Solicitud_Reportes_OT', [''])
     Solicitud_Reportes_OT: Solicitud_Reportes_OT[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

