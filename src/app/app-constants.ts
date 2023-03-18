/**
 * Constants used throughout the application.
 */

import { FileInputConfig } from 'ngx-material-file-input';

export class EndpointNames {
    static WebApi = 'WebApi';
    static CloudPDF = "CloudPDF"
}
export class StorageKeys {
    static Language = 'LANGUAGE';
    static KeyValueInserted = 'KeyValueInserted';
}

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    },
};
export const FILE_INPUT_CONFIG: FileInputConfig = {
    sizeUnit: 'Octet'
};

export const Permisos = {
    Catalogo_codigo_ATA: 46769,
    Ciudad: 46058,
    Estado: 46057,
    Modelos: 45938,
    Pais: 46036,
    Tipo_de_Cambio: 46047,
    Actividades_de_los_Colaboradores: 46703,
    Agrupacion_Concepto_Balance_General: 46953,
    Agrupacion_de_Reportes: 46832,
    Ano: 46944,
    Aplicacion__de_Prestamo: 47012,
    Salida_en_Almacen_de_partes: 46748,
    Autorizacion: 46578,
    Autorizacion_de_Prefactura_Aerovics: 46777,
    Ayuda_de_respuesta_crear_reporte: 46781,
    Bitacora: 46251,
    Boletines_Directivas_aeronavegatibilidad: 46083,
    Calendario_Configuracion: 46306,
    Calendario_Configuracion_Rol: 46308,
    Carga_Manual: 46942,
    Cargo_de_Tripulante: 46121,
    Cargos: 45960,
    Cat__reportes_prestablecidos: 46655,
    Catalago_Manual_de_Usuario: 47011,
    Catalogo_Actividades_de_Colaboradores: 46705,
    Aeropuertos: 46056,
    Aeronave: 45942,
    Creacion_de_Proveedores: 45967,
    Herramientas: 46665,
    Listado_de_Materiales: 46019,
    Partes: 46663,
    Catalogo_Reportes: 46835,
    Catalogo_servicios: 46673,
    Catalogo_Tipo_de_Vencimiento: 46728,
    Categoria_de_Partes: 46741,
    Categorias_y_Documentos_Requeridos: 47018,
    Categorias_y_Documentos_Requeridos_de_Partes: 46735,
    Causa_de_remocion: 46929,
    Cierre_de_Vuelo: 46158,
    Clasificacion_de_aeronavegabilidad: 45979,
    Clasificacion_de_proveedores: 45970,
    Cliente: 45941,
    Cliente_Facturacion: 46938,
    CMP_a_Cotizar: 45937,
    Codigo_Computarizado: 45940,
    Colores: 46061,
    Comisariato_y_notas_de_vuelo: 46851,
    Comparativo_de_Proveedores_Piezas: 46629,
    Comparativo_de_Proveedores_Materiales: 46633,
    Comparativo_de_Proveedores_Servicios: 46631,
    Concepto: 46950,
    Concepto_Balance_General: 46954,
    Concepto_de_Comisariato_Normal: 46123,
    Concepto_de_Gasto_de_Aeronave: 46148,
    Concepto_de_Gasto_de_Empleado: 46147,
    Concepto_Estado_de_Resultado: 46958,
    Condicion_del_item: 46543,
    Configuracion_de_Codigo_Computarizado: 45950,
    Impuestos: 46774,
    Configuracion_de_Notificacion: 46222,
    Pasajeros: 46034,
    Configuracion_de_Politicas_de_Viaticos: 46412,
    Configuracion_de_tecnicos_e_inspectores: 45971,
    Creacion_de_Usuarios: 45959,
    Consecutivo_Numero_de_vuelo: 46254,
    Control_de_Calibracion_de_Equipo_y_Herramienta: 47016,
    Control_de_Componentes: 45976,
    Control_Componentes_de_la_Aeronave: 46095,
    Control_de_Herramientas__Materiales_y_Equipo_prestado: 47014,
    Coordinacion_Avisos: 46115,
    Coord__de_Vuelo__Documentacion: 46142,
    Coordinacion_Handling: 46117,
    Coordinacion_Pasajeros: 46130,
    Coord__de_Vuelo__Tripulacion: 46136,
    Costos_de_Importacion: 46738,
    Cotizacion: 45945,
    Creacion_de_Clientes: 45963,
    Crear_Reporte: 46488,
    Departamento: 46577,
    Detalle_Agrupacion_de_Reportes: 46834,
    Detalle_Anticipo_de_Viaticos: 46907,
    Detalle_Cargar_inspecciones_de_calidad: 46751,
    Detalle_cargar_instrucciones: 46966,
    Detalle_Cierre_Pasajeros: 46160,
    Detalle_Cierre_Tripulacion: 46159,
    Detalle_Codigos_Computarizados_Cotizacion: 46177,
    Detalle_Comisariatos: 46291,
    Detalle_Componentes_Tipo_Bitacora_Aeronave: 46311,
    Detalle_Config_Partes_Asociadas: 45951,
    Detalle_Config_Servicios_Asociados: 45952,
    Detalle_Configuracion_de_Politicas_de_Viaticos: 46413,
    Detalle_Coord_Documentacion_Aeronave: 46143,
    Detalle_Coord_Documentacion_PAXs: 46144,
    Detalle_Coord_Paxs_Comisariato_Instalaciones: 46133,
    Detalle_Coord_Paxs_Comisariato_Normal: 46132,
    Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas: 46131,
    Detalle_Coord_Paxs_Reservaciones: 46134,
    Detalle_Coord_Paxs_Transportacion: 46135,
    Detalle_Coord_Tripulacion: 46137,
    Detalle_Coord_Tripulacion_Reservaciones: 46138,
    Detalle_Coord_Tripulacion_Transportacion: 46139,
    Detalle_Coordinacion_Avisos: 46116,
    Detalle_Coordinacion_Handling: 46118,
    Detalle_Coordinacion_Paxs_Servicios: 46128,
    Detalle_Cursos_de_Tripulacion: 46257,
    Detalle_Cursos_Pasajeros: 46250,
    Detalle_de_Actividades_de_Colaboradores: 46704,
    Detalle_de_Agregar_Proveedor_Piezas: 46630,
    Detalle_de_Agregar_Proveedor_Materiales: 46634,
    Detalle_de_Agregar_Proveedor_Servicios: 46632,
    Detalle_de_Calibracion_por_Herramienta: 47017,
    Detalle_de_Compras_de_Importacion: 46737,
    Detalle_de_Compras_en_exportacion: 46740,
    detalle_de_configuracion_de_proveedores: 46696,
    Detalle_de_Cuadro_Comparativo: 46852,
    Detalle_de_Documentos_Cursos: 45973,
    Detalle_de_Documentos_Tecnicos: 45972,
    Detalle_de_Generacion_de_OC: 46677,
    Detalle_de_Gestion_de_aprobacion: 46675,
    Detalle_de_Herramientas_y_Equipo_Prestado: 47015,
    detalle_de_imagenes_de_aeronave: 46529,
    Detalle_Inspeccion_Salida: 46768,
    Detalle_de_Instalacion_de_piezas: 46686,
    Detalle_de_Item_Compras_Generales: 46559,
    Detalle_de_Item_Servicios: 46554,
    Detalle_de_Lista_Predeterminada: 46555,
    Detalle_de_Listado_de_Ordenes_de_Trabajo: 46509,
    Detalle_de_Listado_de_Pago_de_Proveedores: 46731,
    Detalle_de_Materiales: 46619,
    Detalle_de_Remocion_de_piezas: 46685,
    Detalles_de_trabajo_de_OT: 46612,
    Detalle_de_reportes_por_aeronave: 46721,
    Detalle_de_reportes_por_componentes: 46720,
    Detalle_de_Reportes_Prestablecidos: 46654,
    Detalle_de_Seguimiento_de_Solicitud_de_Compras: 46664,
    Detalle_de_Seguros_Asociados: 46636,
    Detalle_de_Solicitud_de_partes_materiales_y_herramientas: 46747,
    Detalle_de_Solicitud_de_Piezas: 46611,
    Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales: 46614,
    Detalle_Ejecucion_de_vuelo_pasajeros: 46162,
    Detalle_Ejecucion_de_vuelo_pasajeros_adicionales: 46424,
    Detalle_Ejecucion_Vuelo_Altimetros: 46167,
    Detalle_Ejecucion_Vuelo_Componentes: 46166,
    Detalle_Ejecucion_Vuelo_Parametros: 46165,
    Detalle_Empresas_Conf_Usuario: 46247,
    Detalle_FBO: 46289,
    Detalle_Frecuencia_Notificaciones: 46215,
    Detalle_Gastos_Aeronave: 46153,
    Detalle_Gastos_Anticipo_Viaticos: 46415,
    Detalle_Gastos_Empleado: 46152,
    Detalle_Gastos_Resumen: 46154,
    Detalle_Historial_Motivo_Edicion: 45949,
    Detalle_Hoteles: 46290,
    Detalle_Inspeccion_Entrada_Aeronave: 46542,
    Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave: 46312,
    Detalle_Listado_de_compras_en_proceso: 46743,
    Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: 46725,
    Detalle_Listado_Inspeccion_Inical: 46230,
    Detalle_Motores_de_Aeronave: 46287,
    Detalle_multiselect_proveedores: 46668,
    Detalle_Parametros_Tipo_Bitacora_Aeronave: 46310,
    Detalle_Parte_Asociada_al_Componente_Aeronave: 46084,
    Detalle_Parte_Asociada_Componentes: 45978,
    Detalle_Partes_CMP_Cotizar: 45947,
    Detalle_Partes_Cotizacion: 46178,
    Detalle_Pasajeros_Solicitud_de_Vuelo: 46110,
    Detalle_pasajeros_tramo_de_vuelo: 46111,
    Detalle_Pista_de_Aeropuerto: 46288,
    Detalle_Politicas_Cuota_Consumibles: 45955,
    Detalle_Politicas_Partes_Cliente_Contrato: 45956,
    Detalle_Politicas_Partes_Cliente_No_Contrato: 45957,
    Detalle_Politicas_Mano_de_Obra: 45954,
    Detalle_Politicas_Terceros: 45958,
    Detalle_Registro_Vuelo_Pasajeros: 46114,
    Detalle_Registro_Vuelo_Tripulacion: 46113,
    Detalle_Seguros_Asociados_a: 46252,
    Detalle_Servicios_Asociados_Componentes: 45980,
    Detalle_Servicios_Asociados_Control_Componentes: 46088,
    Detalle_Servicios_Externos_CMP_Cotizar: 45948,
    Detalle_Servicios_Externos_Cotizacion: 46179,
    Detalle_Solicitud_de_Cotizacion: 46667,
    Detalle_Solicitud_de_Herramientas_Crear_reporte: 46695,
    Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: 46681,
    Detalle_Solicitud_de_Materiales_Crear_reporte: 46694,
    Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: 46623,
    Detalle_Solicitud_de_Partes_Crear_reporte: 46691,
    Detalle_Solicitud_de_Piezas: 46621,
    Detalle_Solicitud_de_Servicios_Crear_reporte: 46693,
    Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: 46622,
    Detalle_Tabla_de_Control_de_Componentes: 46475,
    Detalle_tiempo_ejecutantes_crear_reporte: 46779,
    Detalle_Toma_de_Tiempos_Componentes: 46169,
    Detalle_Tramo_de_vuelo: 46112,
    Detalle_Transportes: 46292,
    Discrepancias_Pendientes_Salida: 46687,
    Documentacion_de_Aeronave: 46140,
    Documentacion_de_Pasajero: 46141,
    Documentos_Requeridos: 46848,
    Spartan_Record_Detail_Management: 46180,
    Ejecucion_de_Vuelo: 46161,
    Equipo_de_Navegacion: 46239,
    Estatus_Aeronave: 46098,
    Estatus_autorizacion_de_prefactura: 46776,
    Estatus_de_Calibracion: 47013,
    Estatus_de_Cierre_de_Vuelo: 46157,
    Estatus_de_Cliente: 45964,
    Estatus_de_CMP_a_Cotizar: 45935,
    Estatus_de_componente: 45977,
    Estatus_de_Confirmacion: 46119,
    Estatus_de_Cotizacion: 45931,
    Estatus_de_facturacion_de_vuelo: 46857,
    Estatus_de_Funcionalidad_para_Notificacion: 46217,
    Estatus_de_Gastos_de_Vuelo: 46146,
    Estatus_de_Orden_de_Trabajo: 46510,
    Estatus_Reporte: 46030,
    Estatus_de_Proveedor: 45968,
    Estatus_de_remocion: 46931,
    Estatus_de_Reporte: 46527,
    Estatus_de_Requerido: 46734,
    Estatus_de_Revision_en_Cotizacion: 45932,
    Estatus_de_Seguimiento: 46609,
    Estatus_de_Seguimiento_de_Materiales: 46733,
    Estatus_de_Solicitud_de_Compras: 46549,
    Estatus_de_Solicitud_de_Compras_Generales: 46579,
    Estatus_de_Solicitud_de_Vuelo: 46107,
    Estatus_de_Usuario: 45961,
    Estatus_Detalle_Servicios_Asociados_Control_Componentes: 46556,
    Estatus_Gestion_Aprobacion: 46881,
    Estatus_Modulo_de_Mantenimiento: 46207,
    Estatus_Notificacion: 46213,
    Estatus_Parte_Asociada_al_Componente: 46089,
    Estatus_Tripulacion: 46238,
    Existencia_solicitud_crear_reporte: 46692,
    Fabricante: 46097,
    Facturacion_de_Vuelo: 46772,
    Facturacion_de_vuelos_por_tramo: 46775,
    Filtros_de_reportes: 46855,
    Folios_Generacion_OC: 46765,
    Forma_de_Pago: 46150,
    Funcionalidades_para_Notificacion: 46219,
    Gastos_de_Vuelo: 46151,
    Generacion_de_Orden_de_Compras: 46676,
    Genero: 46038,
    Gestion_de_aprobacion: 46674,
    Historial_de_Cambios: 46155,
    Historial_de_Instalacion_de_partes: 46924,
    Historial_de_Remocion_de_partes: 46920,
    Horarios_de_Trabajo: 45962,
    Husos_de_horarios: 47121,
    Impresion_de_Bitacora_de_Vuelo: 46458,
    Gestion_de_Exportacion: 46678,
    Gestion_de_Importacion: 46679,
    Ingreso_a_almacen: 46744,
    Ingreso_de_Componente: 46398,
    Ingreso_de_Costos_de_Servicios: 46726,
    Formato_de_salida_de_aeronave: 46684,
    Inspeccion_Entrada_Aeronave: 46196,
    Instalacion: 46124,
    Items: 46198,
    Layout_Balance_General: 46955,
    Layout_Cuentas_por_pagar: 46963,
    Layout_Estado_de_Resultado: 46959,
    Layout_Gastos: 46948,
    Layout_Incidencia_Vuelos: 46962,
    Layout_Presupuestos: 46949,
    Layout_Presupuestos_Ventas: 46956,
    Layout_Proveedores: 46951,
    Lista_Predeterminada: 46553,
    Listado_de_compras_en_proceso: 46742,
    Listado_de_compras_en_proceso_de_Exportacion: 46739,
    Listado_de_compras_en_proceso_de_Importacion: 46736,
    Listado_de_Directivas_de_aeronavegabilidad: 46483,
    Listado_de_Ordenes_de_Trabajo: 46506,
    Listado_de_Pago_de_Proveedores: 46727,
    Listado_de_Vuelo_a_Facturar: 46770,
    Listado_Inspeccion_Inical: 46229,
    Medio_de_Comunicacion: 46122,
    Mes: 46945,
    Modulo_de_Mantenimiento: 46202,
    Modulos_reportes: 46833,
    Moneda: 46149,
    Motivo_de_Edicion_de_Cotizacion: 45933,
    Motivo_de_Viaje: 46106,
    Motores: 46286,
    MS_Calendario_Configuracion: 46307,
    MS_Campos_por_Funcionalidad: 46221,
    MS_Equipo_de_Emergencia: 46023,
    MS_Equipo_de_Supervivencia: 46025,
    Nacionalidad: 46035,
    Nivel_de_Ruido: 46241,
    Nombre_del_Campo_en_MS: 46218,
    Notificacion_de_rechazo_al_ingreso_de_almacen: 46745,
    Notificaciones_de_mantenimiento: 46718,
    Notificaciones_Push: 46908,
    Orden_de_servicio: 46708,
    Orden_de_Trabajo: 46533,
    Origen_de_Aeronave: 46243,
    Pago_a_proveedores: 46836,
    Pago_de_servicios_de_operaciones: 46837,
    Piezas: 45943,
    Piezas_Requeridas: 46511,
    Pistas: 46060,
    Politica_de_Proveedores: 46722,
    Politicas_de_Precios_y_Descuentos: 45953,
    Pre_Solicitud_de_Cotizacion: 46706,
    Presupuesto_Anual: 46771,
    Prioridad_del_Reporte: 46485,
    Procedencia: 46400,
    Productividad_del_area_de_mantenimiento: 46605,
    Propietarios: 46096,
    proveedor_multi: 46669,
    Proveedores_de_Seguros: 46026,
    Proveedores_para_MS: 46670,
    Razon_de_la_Compra: 46551,
    Razon_de_Rechazo_a_Almacen: 46830,
    Reabrir_vuelo: 46928,
    Registro_de_Distancia_SENEAM: 46894,
    Ingreso_de_Costos: 46732,
    Registro_de_vuelo: 46127,
    Remocion_e_instalacion_de_piezas: 46661,
    Reportes_para_OS: 46719,
    Responsable_Incidencia_Vuelo: 46961,
    Respuesta: 45965,
    Respuesta_del_Cliente_a_Cotizacion: 45934,
    Resultado_aprobacion_crear_reporte: 46780,
    Resultado_de_Autorizacion_de_Vuelo: 46108,
    Roles_para_Notificar: 46224,
    Salida_en_almacen: 46749,
    Seguimiento_de_Solicitud_de_Compras: 46610,
    Seguros_Asociados_a_la_Aeronave: 46635,
    Servicios: 45944,
    Servicios_Herramientas_Adicionales_A_Solicitar: 46512,
    Servicios_Aduanales: 46682,
    Sexo: 46037,
    Solicitud_de_Compras_Generales: 46558,
    Solicitud_de_cotizacion: 46666,
    Solicitud_de_Pagos_de_Servicios_de_Operaciones: 46724,
    Solicitud_de_partes_materiales_y_herramientas: 46746,
    Gestion_de_aprobacion_de_mantenimiento: 46620,
    Solicitud_de_Servicios_para_Operaciones: 46552,
    Solicitud_de_Vuelo: 46109,
    Solicitudes_de_mantenimientos_externos: 46711,
    Spartan_Attribute_Bypass: 46182,
    Spartan_Object_ByPass: 46181,
    Spartan_RDM_Filters_Detail: 46183,
    Spartan_RDM_Operations_Detail: 46184,
    Tarifas_de_Vuelo_de_Aeronave: 46773,
    Tecnico_Aeronave: 46246,
    Tiempo_de_remocion: 46930,
    Tipo_Concepto: 46946,
    Tipo_Concepto_Estado_Resultado: 46957,
    Tipo_de_Accion_Notificacion: 46211,
    Tipo_de_Aeropuerto: 46059,
    Tipo_de_Ala: 46293,
    Tipo_de_Aviso: 46358,
    Tipo_de_Bitacora_de_Aeronave: 46309,
    Tipo_de_Boletin: 46085,
    Tipo_de_carga: 46943,
    Tipo_de_Cliente: 45966,
    Tipo_de_Concepto_Balance_General: 46952,
    Tipo_de_Condicion_Aeronave: 46199,
    Tipo_de_Condicion_Parte: 46228,
    Tipo_de_Destino: 46414,
    Tipo_de_Documentacion_Aeronave: 47021,
    Tipo_de_Documentacion_PAXs: 47022,
    Tipo_de_Equipo_de_Emergencia: 46022,
    Tipo_de_Equipo_de_Supervivencia: 46024,
    Tipo_de_Gasto: 46947,
    Tipo_de_Grupo: 46914,
    Tipo_de_Hospedaje: 46125,
    Tipo_de_Ingreso_a_Cotizacion: 45936,
    Tipo_de_Ingreso_de_Gasto: 46145,
    Tipo_de_Instalacion: 46359,
    Tipo_de_Medio_de_Comunicacion: 46120,
    Tipo_de_Miscelaneas: 46606,
    Tipo_de_Notificacion: 46210,
    Tipo_de_Notificacion_Push: 46927,
    Tipo_de_origen_del_reporte: 46652,
    Tipo_de_Piloto: 46104,
    Tipo_de_Posicion_de_Piezas: 46031,
    Tipo_de_producto: 46020,
    Tipo_de_Recordatorio_Notificacion: 46212,
    Tipo_de_Reporte: 45939,
    Tipo_de_Seguro: 46027,
    Tipo_de_Servicios_Aduanales: 46608,
    Tipo_de_Solicitud_de_Compras: 46548,
    Tipo_de_Transportacion: 46126,
    Tipo_de_Transporte: 46607,
    Tipo_de_Tripulante: 46100,
    Tipo_de_urgencia: 46585,
    Tipo_de_vuelo: 46105,
    Tipo_Dia_Notificacion: 46216,
    Tipo_Frecuencia_Notificacion: 46214,
    Tipo_Incidencia_Vuelos: 46960,
    Tipo_orden_de_servicio: 46707,
    Tipo_Persona_Notificar: 46220,
    Tipos_de_Curso: 45974,
    Tipos_de_Modelo_Curso: 45975,
    Tipos_de_Origen_del_Componente: 46087,
    Tipos_de_proveedor: 45969,
    Toma_de_Tiempos_a_aeronaves: 46168,
    Detalle_de_tramos_a_facturar: 46809,
    Tripulacion: 46039,
    Tripulacion_Aeronave: 46244,
    Turbulencia_de_Estela: 46240,
    Unidad: 46021,
    Urgencia: 46550,
    Utilidad: 45930,
    Tipo_de_Orden_de_Trabajo: 46523,
    Permisos: 1
};

export const AppSettings = {
    stringPasswordDefault: 'Temporal01'
};



















































































































































































































































































































































































































