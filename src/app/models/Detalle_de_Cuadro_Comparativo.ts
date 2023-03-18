import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Partes } from './Partes';
import { Catalogo_servicios } from './Catalogo_servicios';
import { Listado_de_Materiales } from './Listado_de_Materiales';
import { Herramientas } from './Herramientas';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';


export class Detalle_de_Cuadro_Comparativo extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Comparativo_de_Proveedores = 0;
    @FormField('FolioDetalle', [0])
    FolioDetalle = null;
    @FormField('TipoMR', [0])
    TipoMR = null;
    @FormField('Partes', null)
    Partes = null;
    Partes_Partes: Partes;
    @FormField('Servicios', null)
    Servicios = null;
    Servicios_Catalogo_servicios: Catalogo_servicios;
    @FormField('Materiales', null)
    Materiales = null;
    Materiales_Listado_de_Materiales: Listado_de_Materiales;
    @FormField('Herramientas', null)
    Herramientas = null;
    Herramientas_Herramientas: Herramientas;
    @FormField('Horas_del_Componente_a_Remover', [0])
    Horas_del_Componente_a_Remover = null;
    @FormField('Ciclos_Componentes_a_Remover', [0])
    Ciclos_Componentes_a_Remover = null;
    @FormField('Condicion_de_la_Pieza_Solicitada', [0])
    Condicion_de_la_Pieza_Solicitada = null;
    @FormField('Fecha_estimada_de_Mtto_', null)
    Fecha_estimada_de_Mtto_ = '';
    @FormField('No__de_Parte___Descripcion', [''])
    No__de_Parte___Descripcion = '';
    @FormField('Cantidad', [0])
    Cantidad = null;

    @FormField('Proveedor_1', [''])
    Proveedor_1 = null;
    Proveedor_1_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Seleccion_1', [false])
    Seleccion_1 = false;
    @FormField('Costo_Unitario_1', ['0.00'])
    Costo_Unitario_1 = '0.00';
    @FormField('Total_1', ['0.00'])
    Total_1 = '0.00';

    @FormField('Proveedor_2', [''])
    Proveedor_2 = null;
    Proveedor_2_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Seleccion_2', [false])
    Seleccion_2 = false;
    @FormField('Costo_Unitario_2', ['0.00'])
    Costo_Unitario_2 = '0.00';
    @FormField('Total_2', ['0.00'])
    Total_2 = '0.00';

    @FormField('Proveedor_3', [''])
    Proveedor_3 = null;
    Proveedor_3_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Seleccion_3', [false])
    Seleccion_3 = false;
    @FormField('Costo_Unitario_3', ['0.00'])
    Costo_Unitario_3 = '0.00';
    @FormField('Total_3', ['0.00'])
    Total_3 = '0.00';

    @FormField('Proveedor_4', [''])
    Proveedor_4 = null;
    Proveedor_4_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Seleccion_4', [false])
    Seleccion_4 = false;
    @FormField('Costo_Unitario_4', ['0.00'])
    Costo_Unitario_4 = '0.00';
    @FormField('Total_4', ['0.00'])
    Total_4 = '0.00';

    @FormField('Detalle_de_Cuadro_Comparativos', [''])
    Detalle_de_Cuadro_Comparativos: Detalle_de_Cuadro_Comparativo[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

