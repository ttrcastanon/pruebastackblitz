import { BaseView } from "../shared/base-views/base-view";
import { FormField } from "../shared/base-views/decorators/reactive-form-decorators";

export class ReportesDetalle extends BaseView {
  @FormField("Folio", [0])
  Folio = 0;
  @FormField("Fecha", [""])
  Fecha = "";
  @FormField("Aeronaves", [""])
  Aeronaves = "";
  @FormField("Imprimir_solo_aeronaves_activas", [false])
  Imprimir_solo_aeronaves_activas = false;
  @FormField("Mostrar_Aeronave", [0])
  Mostrar_Aeronave = 0;
  @FormField("Clientes", [0])
  Clientes = 0;
  @FormField("Imprimir_solo_clientes_activos", [false])
  Imprimir_solo_clientes_activos = false;
  @FormField("Mostrar_Cliente", [0])
  Mostrar_Cliente = 0;
  @FormField("Pasajeros", [0])
  Pasajeros = 0;
  @FormField("Imprimir_solo_pasajeros_activos", [false])
  Imprimir_solo_pasajeros_activos: false;
  @FormField("Mostrar_Pasajero", [0])
  Mostrar_Pasajero = 0;
  @FormField("Pilotos", [0])
  Pilotos = 0;
  @FormField("Imprimir_solo_pilotos_activos", [false])
  Imprimir_solo_pilotos_activos = false;
  @FormField("Mostrar_Piloto", [0])
  Mostrar_Piloto = 0;
  @FormField("Vuelos_como_capitan_o_primer_oficial", [false])
  Vuelos_como_capitan_o_primer_oficial = false;
  @FormField("Aeropuerto", [0])
  Aeropuerto = 0;
  @FormField("Aeropuerto_Destino", [0])
  Aeropuerto_Destino = 0;

  @FormField('Reportes', [''])
  Solicitud_de_Vuelos: ReportesDetalle[] = [];
}
