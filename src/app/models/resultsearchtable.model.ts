// declare module Resultsearchtable {

    export class ValuesColumn {
        Values: string[];
    }

    export class Resultsearchtable {
        Columns: string[];
        ValuesColumns: ValuesColumn[];
    }

    
// }


const form_template = [
    {
      "type":"textBox",
      "label":"Name",
    },
    {
      "type":"number",
      "label":"Age"
    },
    {
      "type":"textBox",
      "label":"Name",
    },
    {
      "type":"number",
      "label":"Age"
    },
    {
      "type":"select",
      "label":"favorite book",
      "options":["Jane Eyre","Pride and Prejudice","Wuthering Heights"]
    }
  ]
  export default form_template

