export function date_to_string_complete(date: Date) {
  let fecha: string = "";
  let anio = date.getFullYear();
  let mes = String(date.getMonth() + 1).padStart(2, '0');
  let dia = String(date.getDate()).padStart(2, '0');
  let hora = String(date.getHours()).padStart(2, '0');
  let minuto = String(date.getMinutes()).padStart(2, '0');
  let second = "00";
  fecha = `${dia}/${mes}/${anio} ${hora}:${minuto}:${second}`
  return fecha;
}

export function date_to_string_only_date(date: Date) {
  let fecha: string = "";
  let anio = date.getFullYear();
  let mes = String(date.getMonth() + 1).padStart(2, '0');
  let dia = String(date.getDate()).padStart(2, '0');
  let hora = String(date.getHours()).padStart(2, '0');
  let minuto = String(date.getMinutes()).padStart(2, '0');
  let second = "00";
  fecha = `${dia}/${mes}/${anio}`
  return fecha;
}


export function date_string_date(date: Date) {
  let obj: any = {};
  obj.anio = date.getFullYear();
  obj.mes = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  obj.dia = String(date.getDate()).padStart(2, '0');
  return `${obj.dia}/${obj.mes}/${obj.anio}`;
}


export function date_to_hour_format(_date: Date) {
  try {
      let hour, minute, second;
      hour = _date.getHours().toString().padStart(2, '0');
      minute = _date.getMinutes().toString().padStart(2, '0');
      second = _date.getSeconds().toString().padStart(2, '0');
      return `${hour}:${minute}:${second}`;
  } catch (error) {
      return "";
  }

}
