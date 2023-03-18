import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Cliente } from './Cliente';
import { Spartan_User } from './Spartan_User';
import { Detalle_de_tramos_a_facturar } from './Detalle_de_tramos_a_facturar';
import { Estatus_de_facturacion_de_vuelo } from './Estatus_de_facturacion_de_vuelo';
import { Facturacion_de_vuelos_por_tramo } from './Facturacion_de_vuelos_por_tramo';


export class Facturacion_de_Vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Hora', [''])
    Hora = '';
    @FormField('Vuelo', [''])
    Vuelo = null;
    Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Seccion', [0])
    Seccion = null;
    @FormField('Tipo', [''])
    Tipo = '';
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Ano', [0])
    Ano = null;
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Solicitante_1', [''])
    Solicitante_1 = null;
    Solicitante_1_Spartan_User: Spartan_User;
    @FormField('Horas_de_vuelo', [''])
    Horas_de_vuelo = null;
    @FormField('Horas_de_Espera', [''])
    Horas_de_Espera = null;
    @FormField('Percnota', [''])
    Percnota = null;
    @FormField('Detalle_de_tramos_a_facturarItems', [], Detalle_de_tramos_a_facturar,  true)
    Detalle_de_tramos_a_facturarItems: FormArray;

    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_facturacion_de_vuelo: Estatus_de_facturacion_de_vuelo;
    @FormField('Fecha_de_la_factura', [''])
    Fecha_de_la_factura = '';
    @FormField('Servicios_Terminal_Total', [''])
    Servicios_Terminal_Total = null;
    @FormField('Comisariato_Total', [''])
    Comisariato_Total = null;
    @FormField('Despacho', [''])
    Despacho = null;
    @FormField('TUA_Nacional', [''])
    TUA_Nacional = null;
    @FormField('TUA_Nacional_Total', [''])
    TUA_Nacional_Total = null;
    @FormField('TUA_Internacional', [''])
    TUA_Internacional = null;
    @FormField('TUA_Internacional_Total', [''])
    TUA_Internacional_Total = null;
    @FormField('IVA_Frontera', [0])
    IVA_Frontera = null;
    @FormField('IVA_Frontera_Total', [''])
    IVA_Frontera_Total = null;
    @FormField('IVA_Nacional', [0])
    IVA_Nacional = null;
    @FormField('IVA_Nacional_Total', [''])
    IVA_Nacional_Total = null;
    @FormField('SubTotal', [''])
    SubTotal = null;
    @FormField('Tiempo_de_Vuelo', [''])
    Tiempo_de_Vuelo = '';
    @FormField('Tiempo_de_Vuelo_Total', [''])
    Tiempo_de_Vuelo_Total = null;
    @FormField('Tiempo_de_Espera', [''])
    Tiempo_de_Espera = '';
    @FormField('Espera_sin_Cargo', [''])
    Espera_sin_Cargo = '';
    @FormField('Espera_con_Cargo', [''])
    Espera_con_Cargo = '';
    @FormField('Espera_con_Cargo_Total', [''])
    Espera_con_Cargo_Total = null;
    @FormField('Pernocta', [0])
    Pernocta = null;
    @FormField('Pernoctas_Total', [''])
    Pernoctas_Total = null;
    @FormField('IVA_Nacional_Servicios', [''])
    IVA_Nacional_Servicios = null;
    @FormField('IVA_Nacional_Servicios_Total', [''])
    IVA_Nacional_Servicios_Total = null;
    @FormField('IVA', [0])
    IVA = null;
    @FormField('IVA_Internacional_Total', [''])
    IVA_Internacional_Total = null;
    @FormField('Cargo_vuelo_int_', [0])
    Cargo_vuelo_int_ = null;
    @FormField('Cargo_Vuelo_Int__Total', [''])
    Cargo_Vuelo_Int__Total = null;
    @FormField('IVA_vuelo_int_', [0])
    IVA_vuelo_int_ = null;
    @FormField('IVA_Vuelo_Int__Total', [''])
    IVA_Vuelo_Int__Total = null;
    @FormField('SubTotal_1', [''])
    SubTotal_1 = null;
    @FormField('Servicios_de_Terminal', [''])
    Servicios_de_Terminal = null;
    @FormField('Comisariato_1', [''])
    Comisariato_1 = null;
    @FormField('Despacho_1', [''])
    Despacho_1 = null;
    @FormField('Margen', [''])
    Margen = null;
    @FormField('Total_a_pagar', [''])
    Total_a_pagar = null;
    @FormField('Facturacion_de_vuelos_por_tramoItems', [], Facturacion_de_vuelos_por_tramo,  true)
    Facturacion_de_vuelos_por_tramoItems: FormArray;

    @FormField('SAPSA_Monto', [''])
    SAPSA_Monto = null;
    @FormField('SAPSA_Porcentaje', [''])
    SAPSA_Porcentaje = null;
    @FormField('GNP_Monto', [''])
    GNP_Monto = null;
    @FormField('GNP_Porcentaje', [''])
    GNP_Porcentaje = null;
    @FormField('PH_Monto', [''])
    PH_Monto = null;
    @FormField('PH_Porcentaje', [''])
    PH_Porcentaje = null;

     @FormField('Facturacion_de_Vuelos', [''])
     Facturacion_de_Vuelos: Facturacion_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

