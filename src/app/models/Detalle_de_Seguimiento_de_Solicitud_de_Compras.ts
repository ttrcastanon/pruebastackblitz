import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Unidad } from './Unidad';
import { Departamento } from './Departamento';
import { Urgencia } from './Urgencia';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';


export class Detalle_de_Seguimiento_de_Solicitud_de_Compras extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Seguimiento_de_Solicitud_de_Compras = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Condicion', [''])
    Condicion = '';
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Razon_de_la_Compra', [''])
    Razon_de_la_Compra = '';
    @FormField('Urgencia', [''])
    Urgencia = null;
    Urgencia_Urgencia: Urgencia;
    @FormField('Fecha_de_Entrega', [''])
    Fecha_de_Entrega = '';
    @FormField('Matricula', [''])
    Matricula = '';
    @FormField('Modelo', [''])
    Modelo = '';
    @FormField('No__de_Reporte', [''])
    No__de_Reporte = '';
    @FormField('No_O_T', [''])
    No_O_T = '';
    @FormField('Fecha_estimada_de_Mtto_', [''])
    Fecha_estimada_de_Mtto_ = '';
    @FormField('Estatus', [''])
    Estatus = '';
    @FormField('Solicitante', [''])
    Solicitante = '';
    Solicitante_clave = 0;

    Ciclos_del_componente_a_Remover = null;
    Horas_del_Componente_a_Remover = null;


    @FormField('No__de_Solicitud', [''])
    No__de_Solicitud = '';
    @FormField('Estatus_de_Seguimiento', [''])
    Estatus_de_Seguimiento = null;
    Estatus_de_Seguimiento_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('Folio_de_detalle', [0])
    Folio_de_detalle = null;
    @FormField('Folio_de_solicitud', [0])
    Folio_de_solicitud = null;
    @FormField('Tipo_MR', [0])
    Tipo_MR = null;
    @FormField('Motivo_de_Rechazo', [''])
    Motivo_de_Rechazo = '';

    Urgencia_Descripcion = ""
    Unidad_Descripcion = ""
    Departamento_Nombre = ""

    @FormField('Gestion_de_compras', [''])
    Gestion_de_compras: boolean = false;

    @FormField('Cotizar', [''])
    Cotizar: boolean = false;
    Cancelar = '';

    @FormField('Detalle_de_Seguimiento_de_Solicitud_de_Comprass', [''])
    Detalle_de_Seguimiento_de_Solicitud_de_Comprass: Detalle_de_Seguimiento_de_Solicitud_de_Compras[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

