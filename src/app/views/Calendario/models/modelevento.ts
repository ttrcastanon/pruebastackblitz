export class event{
    title:string;
    matricula:string;
    horariosSalida:string;
    horariosLLegada:string;
    estatus:string;
    tramos:string;
    tramosHorarios:string;
    numero_de_vuelo: string; 
    numero_de_solicitud: string; 
    _url: string;
    imagen: string;

    start:Date;
    end:Date;
    allDay: boolean; 
    imageurl: string;
    classNames: string;
    eventContent: string;
    color: string;
    customHtml: string;

    notas_vuelo: string;
    comisariato: string;

    //Datos del Registro de vuelo
    registros_vuelo : any[];
    rol: String;
    mantenimiento:number;
    }