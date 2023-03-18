import { LeadingComment } from "@angular/compiler";
import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";

/**
 * data with nested structure.
 * Each node has a name and an optional list of children.
 */
export class itemNode {
  id: number;
  item: string;
  checked?: boolean;
  children?: itemNode[];
  User_Rule_Module_Id: number;
  Order_Shown: number;
}

const TREE_DATA = {
  Modules: {
    // "Administrador de Seguridad": {
    //   checked: false,
    //   id: 23,
    //   User_Rule_Module_Id: 1,
    //   Order_Shown: 1
    // },
    // "Business Rules": {
    //   checked: false,
    //   id: 24,
    //   User_Rule_Module_Id: 2,
    //   Order_Shown: 2
    // },
    // "Catálogos": {
    //   checked: false,
    //   id: 25,
    //   User_Rule_Module_Id: 3,
    //   Order_Shown: 3
    // },
    // "Formatos": {
    //   checked: false,
    //   id: 26,
    //   User_Rule_Module_Id: 4,
    //   Order_Shown: 4
    // },
    // "Reportes": {
    //   checked: false,
    //   id: 27,
    //   User_Rule_Module_Id: 5,
    //   Order_Shown: 5
    // },
    // "Spartane Language": {
    //   checked: false,
    //   id: 28,
    //   User_Rule_Module_Id: 6,
    //   Order_Shown: 6
    // },
    // "Spartane Workflow": {
    //   checked: false,
    //   id: 29,
    //   User_Rule_Module_Id: 7,
    //   Order_Shown: 7
    // }
  },
};

/** Flat node with expandable and level information */
export class TodoItemFlatNode {
  expandable: boolean;
  item: string;
  level: number;
  checked: boolean;
  id: number;
  User_Rule_Module_Id: number;
  Order_Shown: number;
}

@Injectable()
export class ModuleTreeService {

  dataChange = new BehaviorSubject<itemNode[]>([]);
  idSelectedRole = new BehaviorSubject<number>(0);
  selectedNodeTree = new BehaviorSubject<TodoItemFlatNode>(new TodoItemFlatNode);
  objectModuleSelected: any = new BehaviorSubject<any>({}); //TODO Revisar necesidad
  lstDataHolder: any = new BehaviorSubject<any>([]);

  get data(): itemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `itemNode` with nested
    //     file node as children.

    const data = this.buildFileTree(TREE_DATA, 0);
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `itemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): itemNode[] {

    return Object.keys(obj).reduce<itemNode[]>((accumulator, key) => {

      const value = obj[key];

      const node = new itemNode();
      node.item = key;

      if (key === "Modules") {
        if (typeof value === "object") {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      } else {
        if (value != null) {
          if (typeof value === "object") {
            node.checked = value.checked;
            node.id = value.id;
            node.User_Rule_Module_Id = value.User_Rule_Module_Id;
            node.Order_Shown = value.Order_Shown;
          } 
        }
      }
      return accumulator.concat(node);
    }, []);
  }

  insertItem(parent: itemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as itemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: itemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }

  updateTree(newTree){
    const newData = this.buildFileTree(newTree, 0);
    this.dataChange.next(newData);
  }
}
