import { Injectable } from '@angular/core';
import { Script } from 'src/app/models/enums/script.enum';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {

  constructor() { }

  carga(type: Script , archivos:string[]){
    for (let archivo of archivos) {
      let script = document.createElement("script");
      script.src = `${type}${archivo}.js`;
      let body = document.getElementsByTagName("body")[0];
      body.append(script);
    }
  }

}
