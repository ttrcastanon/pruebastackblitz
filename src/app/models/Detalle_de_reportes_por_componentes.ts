import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Crear_Reporte } from './Crear_Reporte';
import { Reportes_para_OS } from './Reportes_para_OS';
import { Spartan_User } from './Spartan_User';


export class Detalle_de_reportes_por_componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    ID_orden_servicio = 0;
    @FormField('Reporte', [''])
    Reporte = null;
    Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Tipo_de_OS', [''])
    Tipo_de_OS = null;
    Tipo_de_OS_Reportes_para_OS: Reportes_para_OS;
    @FormField('Descripcion_de_Reporte', [''])
    Descripcion_de_Reporte = '';
    @FormField('Descripcion_del_componente', [''])
    Descripcion_del_componente = '';
    @FormField('Numero_de_parte', [''])
    Numero_de_parte = '';
    @FormField('Numero_de_serie', [''])
    Numero_de_serie = '';
    @FormField('Datos_del_cliente', [''])
    Datos_del_cliente = '';
    @FormField('Asignado_a', [''])
    Asignado_a = null;
    Asignado_a_Spartan_User: Spartan_User;
    @FormField('Asignado_a_1', [''])
    Asignado_a_1 = null;
    Asignado_a_1_Spartan_User: Spartan_User;
    @FormField('Asignado_a_2', [''])
    Asignado_a_2 = null;
    Asignado_a_2_Spartan_User: Spartan_User;
    @FormField('Asignado_a_3', [''])
    Asignado_a_3 = null;
    Asignado_a_3_Spartan_User: Spartan_User;
    @FormField('Asignado_a_4', [''])
    Asignado_a_4 = null;
    Asignado_a_4_Spartan_User: Spartan_User;
    @FormField('Notificado', [0])
    Notificado = null;

     @FormField('Detalle_de_reportes_por_componentess', [''])
     Detalle_de_reportes_por_componentess: Detalle_de_reportes_por_componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
     users: any = []
     users1: any = []
     users2: any = []
     users3: any = []
     users4: any = []
}

