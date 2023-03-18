import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { ModuleTreeService, itemNode, TodoItemFlatNode } from '../../../../../api-services/module-tree.service';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { SpartanUserRuleModuleService } from "src/app/api-services/spartan-user-rule-module.service";
import { UserRuleModule } from "src/app/models/spartan-user-rule-module";



@Component({
  selector: "app-module-tree",
  templateUrl: "./module-tree.component.html",
  styleUrls: ["./module-tree.component.scss"]
})
export class ModuleTreeComponent {

  /** Map from flat node to nested node. This helps to finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, itemNode>();

  /** Map from nested node to flattened node. This helps to keep the same object for selection */
  nestedNodeMap = new Map<itemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<itemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<itemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);


  constructor(
    private _moduleTreeService: ModuleTreeService,
    private _spartanUserRuleModuleService: SpartanUserRuleModuleService,
    ){
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _moduleTreeService.dataChange.subscribe(data => {
      this.dataSource.data = data;
      setTimeout(() => {
        const element: HTMLElement = document.getElementsByClassName('btnCheckAll')[0] as HTMLElement;
        element.click();
      }, 0);
    });

  }



  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: itemNode): itemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: itemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.checked = node.checked;
    flatNode.id = node.id;
    flatNode.User_Rule_Module_Id = node.User_Rule_Module_Id;
    flatNode.Order_Shown = node.Order_Shown;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }


  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    // console.log('descendantsAllSelected');
    // console.log(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    // console.log('descendantsPartiallySelected');
    // console.log(node);
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {

    for (let index = 0; index < this.dataSource.data[0].children.length; index++) {
      const element = this.dataSource.data[0].children[index];
      if (element.id === node.id) {        
        if (element.checked) {
          // IF check change to false must be delete in db
          element.checked = !element.checked;
          this._spartanUserRuleModuleService.deleteRuleModule(element.User_Rule_Module_Id, this._moduleTreeService.idSelectedRole.value).subscribe(res => console.log(res), err => console.error(err));
        } else {
          element.checked = !element.checked;
          // if check changes to true, must be inserted

          const obj:UserRuleModule = {
            User_Rule_Module_Id: element.User_Rule_Module_Id,
            Module_Id: element.id,
            Id: 0,
            Order_Shown: element.Order_Shown,
            Spartan_User_Role: this._moduleTreeService.idSelectedRole.value,
            Module_Id_Spartan_Module: null,
            Spartan_User_Role_Spartan_User_Role: null
          }
          this._spartanUserRuleModuleService.insert(obj).subscribe( res => console.log(res), err => console.error(err) );
        }
                 
      }      

    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    // console.log('checkAllParentsSelection');
    // console.log(node);
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    // console.log('checkRootNodeSelection');
    // console.log(node);
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    // console.log('getParentNode');
    // console.log(node);
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._moduleTreeService.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._moduleTreeService.updateItem(nestedNode!, itemValue);
  }

  selectModule(node: TodoItemFlatNode){
    this._moduleTreeService.selectedNodeTree.next(node);
  }

  ngOnDestroy(){
  }


}
