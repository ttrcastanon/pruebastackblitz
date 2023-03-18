import { Solicitud_de_Tramite } from "./solicitud-de-Tramite";
import { Documentacion_requerida_de_tramite_custom } from "./Documento_Requerido_de_Subtramite_custom";
import { Atencion_de_Tramite } from "./atencion-de-Tramite";
import { Observacion_de_tramite } from "./Observacion_de_tramite";

export class RegistrarTramite {

    solicitud_De_Tramite: Solicitud_de_Tramite;
    documentacion_requerida_de_tramite: Documentacion_requerida_de_tramite_custom[];
    observaciones_de_tramite: Observacion_de_tramite[];
    atencion_de_Tramite: Atencion_de_Tramite;
    constructor() {
        this.solicitud_De_Tramite = new Solicitud_de_Tramite();
        this.documentacion_requerida_de_tramite = [];
        this.observaciones_de_tramite = [];
        this.atencion_de_Tramite = new Atencion_de_Tramite();
    }
}
