import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DynamicSearchService } from '../../api-services/dynamicsearch.service';
import { HttpClient } from '@angular/common/http';
import { DataToShow, Details, ValuesColumn, Detail } from '../../models/datatoshow.model';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SearchField } from 'src/app/models/searchfield.model';
import { Resultsearchtable } from 'src/app/models/resultsearchtable.model';

declare var $: any;

@Component({
	selector: 'app-dynamicsearchtable',
	templateUrl: './dynamicsearchtable.component.html',
	styleUrls: ['./dynamicsearchtable.component.sass']
})
export class DynamicsearchtableComponent implements OnInit {

	exampleDatabase: DynamicSearchService | null;
	DataToShowData: DataToShow | null;
	DataResultsearchtable: Resultsearchtable | null;
	DataSearchField: SearchField[] | null;
	Field: SearchField | null;
	Detail: Detail | null;

	displayedColumns: string[] = [];
	tableData: string[] = [];
	tableData2: string[] = [];
	tableDataDetail: string[] = [];
	tableDataHeaders: string[] = [];
	displayedColumnsTabs: string[] = [];
	displayedColumnsDetail: string[] = [];
	columns3: object[] = [];

	id: number;
	wf: number;
	p: number;

	objectId: number;
	idModule: number;
	idTablero: number;

	selectedRow;
	selectedRowIndex: number = 0;
	expedienteLabel: string;
	expedienteText: string;
	index: number = 0;
	indexString: string;

	columnsDetails: object[] = [];
	myFormGroup: FormGroup;

	submitted = false;
	expanded = true;
	expandedSearch = true;
	firstSearch = false;
	withoutdata: boolean = true;
	permisionDelete: boolean = true;

	constructor(
		public DynamicSearchService: DynamicSearchService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		public httpClient: HttpClient,
	) {
		
	 }

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			//console.log(params['id']);
			this.id = params['id'];
			//console.log(params['wf']);
			this.wf = params['wf'];
			//console.log(params['p']);
			this.p = params['p'];

		});

		this.loadData();
	}

	loadData() {

		this.DynamicSearchService
			.getSearchFieldsI(this.id.toString())
			.subscribe((data: SearchField[]) => {
				// this.DataSearchField = data[];
				// //console.log( this.DataSearchField)
				this.DataSearchField = data;
				let group = {}
				this.DataSearchField.forEach(input_template => {
					group[input_template.Label] = new FormControl('');
				})
				this.myFormGroup = this.formBuilder.group(group);
			});




		this.DynamicSearchService
			.getResultSearchTableI(this.id, null)
			.subscribe((data: Resultsearchtable) => {
				this.DataResultsearchtable = data;
				//console.log(this.DataResultsearchtable)
				this.displayedColumns = this.DataResultsearchtable.Columns;
				this.tableData = this.generateData();

			});
	}

	generateData() {
		var ValuesColumns = this.DataResultsearchtable.ValuesColumns;
		var innerIndex: number = 0;
		var outerIndex: number = 0;
		var value: string;
		var tableRow: string[] = [];
		var tableData: any[] = [];
		do {
			innerIndex = 0;
			do {
				value = ValuesColumns[outerIndex].Values[innerIndex].toString();
				tableRow.push(value.toString());
			}
			while (innerIndex++ < ValuesColumns[outerIndex].Values.length - 1);

			tableData.push(tableRow);
			tableRow = [];

		}
		while (outerIndex++ < ValuesColumns.length - 1);

		return tableData;

	}

	getRecord(data) {
		this.firstSearch = true;
		this.selectedRow = this.selectedRow === data ? null : data
		this.selectedRowIndex = data[0];

		this.DynamicSearchService
			.getDataToShowI(this.selectedRowIndex, this.id.toString())
			.subscribe((data: DataToShow) => {
				this.DataToShowData = data;
				this.tableData2 = this.generateData2();

				// this.columnsDetails = this.generateColumns3 (this.index);
				// this.tableDataDetail = this.generateData3 (this.index);

				this.displayedColumnsTabs = this.generateHeadersTabs();
				this.tableDataHeaders = this.generateHeadersTabsData();

			});

	}

	generateData2() {
		this.expedienteLabel = this.DataToShowData.Label;
		this.expedienteText = this.DataToShowData.LabelValue;
		let ValuesColumns = this.DataToShowData.Data;
		var outerIndex: number = 0;
		var value: string = '';
		var values: string = '';
		var label: string = '';
		var typecontrol: string = '';
		var fieldDB: string = '';
		var group: string = '';
		var selAllName: string = '';
		var tableRow: string[] = [];
		var tableData: any[] = [];
		do {
			label = ValuesColumns[outerIndex].Label || '';
			value = ValuesColumns[outerIndex].Value || '';
			typecontrol = ValuesColumns[outerIndex].TypeControl || '';
			fieldDB = ValuesColumns[outerIndex].FieldDB || '';
			values = ValuesColumns[outerIndex].Values || '';
			group = ValuesColumns[outerIndex].Group || '';
			selAllName = ValuesColumns[outerIndex].SelAllName || '';
			tableRow.push(label.toString());
			// tableRow.push (fieldDB.toString());
			// tableRow.push (group.toString());
			// tableRow.push (selAllName.toString());
			// tableRow.push (typecontrol.toString());
			tableRow.push(value.toString());
			// tableRow.push (values.toString());
			tableData.push(tableRow);
			tableRow = [];
		}
		while (outerIndex++ < ValuesColumns.length - 1);
		return tableData;
	}

	generateData3(index: number = 0) {
		var innerIndex: number = 0;
		var outerIndex: number = 0;
		var tableData: any[] = [];
		var ValuesColumn: ValuesColumn[];
		var Columns: string[] = [];
		var Details: Details;
		var tableRow: string[] = [];
		var tableData: any[] = [];
		var value: string;
		Details = this.DataToShowData.Details[index].Details;
		ValuesColumn = Details.ValuesColumns;
		Columns = Details.Columns;
		if (Columns) {
			do {
				innerIndex = 0;
				do {
					value = ValuesColumn[outerIndex].Values[innerIndex].toString();
					tableRow.push(value.toString());
				}
				while (innerIndex++ < ValuesColumn[outerIndex].Values.length - 1);
				tableData.push(tableRow);
				tableRow = [];
			}
			while (outerIndex++ < ValuesColumn.length - 1);
		}
		return tableData;
	}

	generateColumns3(index: number = 0) {
		var ValuesColumn: ValuesColumn[];
		var Columns: string[] = [];
		var Details: Details;
		var columnObj: object;
		var columns: object[] = [];
		Details = this.DataToShowData.Details[index].Details;
		ValuesColumn = Details.ValuesColumns;
		Columns = Details.Columns;
		for (var v in Columns) {
			columnObj = new function () {
				this.columnDef = Columns[v].toString();
				this.header = Columns[v].toString();
				this.cell = [];
			}
			columns.push(columnObj)
		}
		return columns;

	}

	generateHeadersTabs() {
		var array = this.DataToShowData.Details;
		var displayedColumns: string[] = [];
		for (var v in array) {
			displayedColumns.push(array[v].Label)
		}
		return displayedColumns;
	}

	generateHeadersTabsData() {
		var ValuesColumns = this.DataToShowData.Details;
		var innerIndex: number = 0;
		var outerIndex: number = 0;
		var value: string;
		var label: string;
		var index: number = 0
		var tableRow: string[] = [];
		var tableData: any[] = [];
		do {
			tableRow.push(innerIndex.toString());
			tableRow.push(ValuesColumns[innerIndex].Label.toString());
			tableRow.push(ValuesColumns[innerIndex].Icon.toString());
			tableRow.push(ValuesColumns[innerIndex].ObjectId.toString());
			tableData.push(tableRow);
			tableRow = [];
		}
		while (innerIndex++ < ValuesColumns.length - 1);
		return tableData;

	}


	tabs: any[] = [{
		title: 'Dynamic Title 1',
		content: 'Dynamic content 1'
	},
	{
		title: 'Dynamic Title 2',
		content: 'Dynamic content 2'
	},
	{
		title: 'Dynamic Title 3',
		content: 'Dynamic content 3',
		removable: true
	}
	];
	addNewTab(): void {
		const newTabIndex = this.tabs.length + 1;
		this.tabs.push({
			title: `Dynamic Title ${newTabIndex}`,
			content: `Dynamic content ${newTabIndex}`,
			disabled: false,
			removable: true
		});
	}

	removeTabHandler(tab: any): void {
		this.tabs.splice(this.tabs.indexOf(tab), 1);
		//console.log('Remove Tab handler');
	}


	tabChanged(event) {
		this.index = event[0];
		this.indexString = event[1];
		this.DynamicSearchService
			.getDetalleBySearchResultI(this.selectedRowIndex.toString(), this.id, this.indexString)
			.subscribe((data: Detail) => {
				//console.log(this.Detail);
				this.Detail = data;
				this.objectId = this.Detail[0].ObjectId || 0;
				this.displayedColumnsDetail = this.generateHeaders3(this.index);
				this.columns3 = this.generateColumns3(this.index);
				this.tableDataDetail = this.generateData3(this.index);

			});

	}

	generateHeaders3(index: number = 0) {
		var displayedColumns: string[] = [];
		var ValuesColumn: ValuesColumn[];
		var Columns: string[] = [];
		var Details: Details;
		Details = this.DataToShowData.Details[index].Details;
		ValuesColumn = Details.ValuesColumns;
		Columns = Details.Columns;
		for (var v in Columns) {
			displayedColumns.push(Columns[v].toString())
		}
		return displayedColumns;

	}

	toggleClass() {
		this.expanded = !this.expanded;
	}

	toggleClassSeach() {
		this.expandedSearch = !this.expandedSearch;
	}

	buscar() {
		//console.log("buscar");
		// //console.log(this.myFormGroup.valueChanges);
		var ValuesColumn: SearchField[] = [];
		for (const field in this.myFormGroup.controls) { // 'field' is a string
			// //console.log($('#'+field+'').attr('data-target'));
			//  //console.log($('#'+field+'').prop('type'));


			//console.log(this.myFormGroup.controls[field].value);
			this.Field = new SearchField()
			this.Field.Label = field;
			this.Field.TypeControl = $('#' + field + '').prop('type');
			this.Field.FieldDB = $('#' + field + '').attr('data-target');
			this.Field.Value = this.myFormGroup.controls[field].value;
			this.Field.Values = "";
			this.Field.Group = "";
			this.Field.SelAllName = "";
			ValuesColumn.push(this.Field);
		}

		this.DynamicSearchService
			.getResultSearchTableI(this.id, ValuesColumn)
			.subscribe((data: Resultsearchtable) => {

				if (data.ValuesColumns != null) {
					this.DataResultsearchtable = data;
					//console.log(this.DataResultsearchtable);
					this.displayedColumns = this.DataResultsearchtable.Columns;
					this.tableData = this.generateData();
					this.withoutdata = true;

				} else {
					//  alert("without information")
					this.withoutdata = false;
					this.DataResultsearchtable = data;
					this.displayedColumns = this.DataResultsearchtable.Columns;
					this.tableData = null;

				}


			});


	}

	myFunction(event): number {
		if (this.DataToShowData.Details.filter(item => item.Label === event[1])[0].Details.ValuesColumns != null) {
			return this.DataToShowData.Details.filter(item => item.Label === event[1])[0].Details.ValuesColumns.length;
		} else {
			return 0;
		}
	}

}