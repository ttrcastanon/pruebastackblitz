
import { Injectable } from '@angular/core';

import { PdfCloudService } from '../api-services/pdf-cloud.service';
import { SpartanService } from '../api-services/spartan.service';
import { base64ToArrayBuffer, saveByteArray } from '../functions/blob-function';

@Injectable({ providedIn: 'root' })

export class PrintHelper {

    constructor(
        private pdfCloudService: PdfCloudService,
        private spartanService: SpartanService,
    ) { }

    //#region Funcionalidad Imprimir 
    async PrintFormats(idFormat, RecordId, NameFile) {

        this.pdfCloudService.GeneratePDF(idFormat, RecordId).subscribe({
            next: (response) => {

                saveByteArray(NameFile + '.pdf', base64ToArrayBuffer(response), 'application / pdf');

            },
        })
    }
    //#endregion
}



