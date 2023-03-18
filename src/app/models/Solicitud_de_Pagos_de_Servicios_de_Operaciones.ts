import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeropuertos } from './Aeropuertos';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';
import { Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones } from './Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones';


export class Solicitud_de_Pagos_de_Servicios_de_Operaciones  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No__de_Vuelo', [''])
    No__de_Vuelo = null;
    No__de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Aeropuerto', [''])
    Aeropuerto = null;
    Aeropuerto_Aeropuertos: Aeropuertos;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems', [], Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones,  true)
    Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems: FormArray;


     @FormField('Solicitud_de_Pagos_de_Servicios_de_Operacioness', [''])
     Solicitud_de_Pagos_de_Servicios_de_Operacioness: Solicitud_de_Pagos_de_Servicios_de_Operaciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

