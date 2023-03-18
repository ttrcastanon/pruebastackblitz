import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import _, { map } from 'underscore';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_TYPE = 'text/csv;charset=utf-8';
const CSV_EXTENSION = '.csv';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

   sheetList = [];
   sheetNameList = [];
   sheetNameListTmp = [];

  constructor() { }

  /**
   * Exportar a Excel
   * @param json : Data a exportar
   * @param excelFileName : Nombre de archivo
   */
  public exportAsExcelFile(json: any[], excelFileName: string): void {

    // const id = this.messageService.loading('Descargando Datos..', { nzDuration: 1500 }).messageId;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);

  }

  /**
   * Exportando a Excel con múltiples hojas
   * @param jsonArray : Data a exportar
   * @param excelFileName : Nombre de archivo
   * @param sheetNames : Nombre de hoja(sheet)
   */
  public exportMultipleAsExcelFile(jsonArray: any[][], excelFileName: string, sheetNames: any[]): void {

    // const id = this.messageService.loading('Descargando Datos..', { nzDuration: 1500 }).messageId;
    let count = 0;

    if (jsonArray) {
      jsonArray.forEach( items => {
        ++count;
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
        const sheetName = 'Sheet' + count;
        this.sheetList.push(worksheet);
        this.sheetNameListTmp.push(sheetName);
      });

      setTimeout(time => {


        if (sheetNames.length === count) {
          this.sheetNameList = sheetNames;
        } else {
          this.sheetNameList = this.sheetNameListTmp;
        }

        const worksSheetsArray =  _.object(this.sheetNameList, this.sheetList);
        const workbook: XLSX.WorkBook = { Sheets: worksSheetsArray, SheetNames: this.sheetNameList };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
       this.saveAsExcelFile(excelBuffer, excelFileName);

      }, 3000);
    }
  }

  /**
   * Exportar a CSV
   * @param rows 
   * @param fileName 
   * @param columns 
   */
  public exportToCsv(rows: object[], fileName: string, columns?: string[], nameColums? : string[]): string {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });
    let  csvContent
      if(nameColums){
        csvContent   =    
      nameColums.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
      }else{
        csvContent   =    
        keys.join(separator) +
        '\n' +
        rows.map(row => {
          return keys.map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date
              ? cell.toLocaleString()
              : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          }).join(separator);
        }).join('\n');
      }
    this.saveAsCsvFile(csvContent, `${fileName}${CSV_EXTENSION}`, CSV_TYPE);
  }

  /**
   * Guardar archivo CSV
   * @param buffer 
   * @param fileName 
   * @param fileType 
   */
  private saveAsCsvFile(buffer: any, fileName: string, fileType: string): void {
    const BOM = '\uFEFF';
    buffer = BOM +buffer;
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }

  /**
   * Guardar archivo XLS
   * @param buffer 
   * @param fileName 
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }


}