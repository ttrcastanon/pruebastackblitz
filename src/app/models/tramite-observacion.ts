
import { date_to_hour_format, date_string_date } from './../functions/date-function'

export class TramiteObservacion {
    observacion: string;
    fecha: Date;
    fecha_string: string;
    hora_string: string;
    constructor() {
        this.observacion = "";
        this.fecha = new Date();
        this.fecha_string = date_string_date(this.fecha);
        this.hora_string = date_to_hour_format(this.fecha);
    }
}
