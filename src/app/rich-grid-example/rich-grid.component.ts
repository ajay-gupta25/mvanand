import { Component, ViewEncapsulation } from '@angular/core';
// for enterprise features
import { GridApi, Module, ColDef, ColGroupDef, GridReadyEvent, CellClickedEvent, CellDoubleClickedEvent, CellContextMenuEvent, ICellRendererParams } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';

import { ProficiencyFilter } from '../filters/proficiency.component.filter';
import { SkillFilter } from '../filters/skill.component.filter';
import RefData from '../data/refData';
import { HeaderGroupComponent } from '../header-group-component/header-group.component';
import { DateComponent } from '../date-component/date.component';
import { SortableHeaderComponent } from '../header-component/sortable-header.component';
import { RendererComponent } from '../renderer-component/renderer.component';
import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { GoogleSheetsService } from '../services/google-sheet/google-sheets.service';
import { GoogleAuthService } from '../services/auth/google-auth.service';
// import jsPDF from 'jspdf';


// set your key here
// import {LicenseManager} from "@ag-grid-enterprise/core";
// LicenseManager.setLicenseKey(<your key>);

@Component({
    selector: 'rich-grid',
    templateUrl: 'rich-grid.component.html',
    styleUrls: ['rich-grid.css', 'proficiency-renderer.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichGridComponent {
    public rowData!: any[];
    public columnDefs!: (ColDef | ColGroupDef)[];
    public rowCount!: string;

    public defaultColDef: ColDef;
    public components: any;
    public sideBar!: boolean;

    public modules: Module[] = [
        ClientSideRowModelModule,
        MenuModule,
        SideBarModule,
        ColumnsToolPanelModule,
        FiltersToolPanelModule,
        StatusBarModule,
        GridChartsModule,
        RowGroupingModule,
        SetFilterModule,
        RangeSelectionModule
    ];

    public api!: GridApi;

    isAuthenticated = false;
    sheetData: any[] = [];
    newValues: any[][] = [
      ['New Value 1', 'New Value 2'],
      ['New Value 3', 'New Value 4'],
    ];
  
    appendedValues: any[][] = [
      ['Appended Value 1', 'Appended Value 2'],
    ];

    options = [
        { label: 'Option 1', value: false },
        { label: 'Option 2', value: true },
        { label: 'Option 3', value: false },
      ];

    columnControl: { [key: string]: boolean } = {
        mobile: false,
        kyc: false,
        address: false,
        middlename: false,
        marriageStatus: false,
        dob: false,
        gautra: false,
        country: false,

        // Add more controls as needed
      };

    constructor(public authService: GoogleAuthService,private sheetsService: GoogleSheetsService) {
        this.defaultColDef = {
            filter: true,
            floatingFilter: true,
            headerComponent: 'sortableHeaderComponent',
            headerComponentParams: {
                menuIcon: 'fa-bars'
            },
            cellDataType: false,
        };

        this.components = {
            sortableHeaderComponent: SortableHeaderComponent,
            agDateInput: DateComponent,
            headerGroupComponent: HeaderGroupComponent,
            rendererComponent: RendererComponent
        };

        this.createRowData();
        this.createColumnDefs();
        this.reset();
    }

    reset() {
        // this.api.resetColumnState();
    }

    controlColumn(columnName: string | number) {
        console.log(columnName, ' : ' ,this.columnControl[columnName]);
        this.api.setColumnsVisible([columnName.toString()], this.columnControl[columnName]);
    }

    // ngOnInit() {
    //     this.checkAuthStatus();
    //   }
    
    //   checkAuthStatus() {
    //     this.isAuthenticated = this.authService.isSignedIn();
    //   }
    
      login() {
        // this.authService.signIn().subscribe(
        //   () => {
        //     this.isAuthenticated = true;
        //     console.log('Login successful!');
        //   },
        //   (error) => console.error('Login failed', error)
        // );
        this.authService.login();
      }

      logout() {
        this.authService.logout();
      }
    
      fetchSheetData() {
        this.sheetsService.getSheetData('Sheet1').subscribe(
          (data) => {
            console.log('Fetched Data:', data);
            this.sheetData = data.values;
          },
          (error) => console.error('Error fetching sheet data:', error)
        );
      }
      fetchSheetData1() {
        this.sheetsService.getSheetData1('Sheet1').subscribe(
          (data) => {
            console.log('Fetched Data:', data);
            this.sheetData = data.values;
          },
          (error) => console.error('Error fetching sheet data:', error)
        );
      }
    
      updateSheetData() {
        this.sheetsService.updateSheetData('Sheet1', 'A2:B3', this.newValues).subscribe(
          (response) => console.log('Sheet updated successfully:', response),
          (error) => console.error('Error updating sheet data:', error)
        );
      }
    
      appendSheetData() {
        this.sheetsService.appendSheetData('Sheet1', this.appendedValues).subscribe(
          (response) => console.log('Data appended successfully:', response),
          (error) => console.error('Error appending sheet data:', error)
        );
      }

      
      appendSheetData1() {
        this.sheetsService.appendData1('Sheet1', this.appendedValues).subscribe(
          (response) => console.log('Data appended successfully:', response),
          (error) => console.error('Error appending sheet data:', error)
        );
      }

    public createRowData() {
        const rowData: any[] = [];

        for (let i = 0; i < 200; i++) {
            const countryData = RefData.countries[i % RefData.countries.length];
            rowData.push({
                name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
                firstname: RefData.firstNames[i % RefData.firstNames.length],
                middlename: RefData.middleNames[i % RefData.middleNames.length],
                lastname: RefData.lastNames[i % RefData.lastNames.length],
                marriageStatus: RefData.marriageStatus[i % RefData.marriageStatus.length],
                gautra: RefData.gautras[i % RefData.gautras.length],
                skills: {
                    android: Math.random() < 0.4,
                    html5: Math.random() < 0.4,
                    mac: Math.random() < 0.4,
                    windows: Math.random() < 0.4,
                    css: Math.random() < 0.4
                },
                dob: RefData.DOBs[i % RefData.DOBs.length],
                address: RefData.addresses[i % RefData.addresses.length],
                years: Math.round(Math.random() * 100),
                proficiency: Math.round(Math.random() * 100),
                country: countryData.country,
                continent: countryData.continent,
                language: countryData.language,
                mobile: createRandomPhoneNumber()
            });
        }

        this.rowData = rowData;
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: '#',
                width: 40,
                checkboxSelection: true,
                filter: false,
                sortable: false,
                suppressMenu: true,
                pinned: true,
                // cellRenderer: 'agGroupCellRenderer',
                // cellRendererParams: {
                //     suppressCount: true,
                //     innerRenderer: countryCellRenderer,
                // },
            },
            {
                headerName: 'User',
                headerGroupComponent: 'headerGroupComponent',
                children: [
                    {
                        field: 'name',
                        width: 150,
                        pinned: true,
                        enableRowGroup: true,
                        enablePivot: false
                    },
                    {
                        headerName: 'Firstname',
                        width: 150,
                        // checkboxSelection: true,
                        // filter: true,
                        sortable: true,
                        suppressMenu: true,
                        pinned: true,
                        field: 'firstname',
                        columnGroupShow: 'open',
                        filter: 'agTextColumnFilter'
                    },
                    {
                        headerName: 'Middlename',
                        width: 150,
                        // checkboxSelection: true,
                        // filter: true,
                        sortable: true,
                        suppressMenu: true,
                        pinned: true,
                        field: 'middlename',
                        columnGroupShow: 'open',
                        filter: 'agTextColumnFilter'
                    },
                    {
                        headerName: 'Surname',
                        width: 150,
                        // checkboxSelection: true,
                        // filter: true,
                        sortable: true,
                        suppressMenu: true,
                        pinned: true,
                        field: 'lastname',
                        columnGroupShow: 'open',
                        filter: 'agTextColumnFilter'
                    },
                    {
                        field: 'country',
                        width: 150,
                        cellRenderer: countryCellRenderer,
                        pinned: true,
                        filterParams: {
                            cellRenderer: countryCellRenderer,
                            cellHeight: 20
                        },
                        enableRowGroup: true,
                        enablePivot: true,
                        columnGroupShow: 'open'
                    },
                    // {
                    //     headerName: 'DOB',
                    //     field: 'dob',
                    //     width: 195,
                    //     pinned: true,
                    //     cellRenderer: (params: ICellRendererParams) => {
                    //         return pad(params.value.getDate(), 2) + '/' +
                    //             pad(params.value.getMonth() + 1, 2) + '/' +
                    //             params.value.getFullYear();
                    //     },
                    //     menuTabs: ['filterMenuTab'],
                    //     filter: 'agDateColumnFilter',
                    //     columnGroupShow: 'open'
                    // }
                ]
            },
            {
                headerName: 'Contact',
                children: [
                    {
                        field: 'mobile',
                        cellRenderer: RendererComponent,
                        minWidth: 150,
                        sortable: false,
                        suppressMenu: true,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        field: 'address',
                        minWidth: 500,
                        suppressMenu: true,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        headerName: 'KYC',
                        field: 'kyc',
                        width: 60,
                        checkboxSelection: true,
                        filter: false,
                        sortable: false,
                        suppressMenu: true,
                        pinned: false
                    },
                ]
            },
            {
                headerName: 'Matrimonial Details',
                children: [
                    {
                        field: 'marriageStatus',
                        minWidth: 150,
                        sortable: false,
                        suppressMenu: true,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        headerName: 'DOB',
                        field: 'dob',
                        width: 150,
                        pinned: false,
                        suppressMenu: true,
                        cellRenderer: (params: ICellRendererParams) => {
                            return pad(params.value.getDate() || 0, 2) + '/' +
                                pad(params.value.getMonth() || 0 + 1, 2) + '/' +
                                params.value.getFullYear() || 0;
                        },
                        menuTabs: ['filterMenuTab'],
                        // filter: 'agDateColumnFilter',
                        // columnGroupShow: 'open'
                    },
                    {
                        field: 'gautra',
                        minWidth: 150,
                        sortable: false,
                        suppressMenu: true,
                        filter: 'agTextColumnFilter'
                    },
                ]
            },
            {
                headerName: 'IT Skills',
                children: [
                    {
                        field: 'skills',
                        width: 125,
                        sortable: false,
                        cellRenderer: skillsCellRenderer,
                        menuTabs: ['filterMenuTab'],
                        filter: SkillFilter,
                        enableRowGroup: true,
                        enablePivot: true
                    },
                    {
                        field: 'proficiency',
                        width: 160,
                        cellRenderer: percentCellRenderer,
                        menuTabs: ['filterMenuTab'],
                        filter: ProficiencyFilter
                    },
                ]
            },
        ];
    }

    private calculateRowCount() {
        if (this.api && this.rowData) {
            const model = this.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    public onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    }

    public onGridReady(params: GridReadyEvent) {
        console.log('onGridReady');

        this.api = params.api;
        this.api.sizeColumnsToFit();

        this.calculateRowCount();
        this.api.resetColumnState();
    }

    public onCellClicked($event: CellClickedEvent) {
        console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field) + ' ' + $event;
    }

    public onCellDoubleClicked($event: CellDoubleClickedEvent) {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onCellContextMenu($event: CellContextMenuEvent) {
        console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onQuickFilterChanged($event: any) {
        this.api.setQuickFilter($event.target.value);
    }

    public invokeSkillsFilterMethod() {
        this.api.getFilterInstance('skills', (instance) => {
            (instance as any).helloFromSkillsFilter();
        });
    }

    public dobFilter() {
        this.api.getFilterInstance('dob', (dateFilterComponent: any) => {
            dateFilterComponent.setModel({
                type: 'equals',
                dateFrom: '2000-01-01'
            });

            this.api.onFilterChanged();
        });
    }

    public toggleSidebar($event: any) {
        this.sideBar = $event.target.checked;
    }

    public exportExcel() {
        console.log('export to excel:');
        
    }

    generatePDF(data: any): void {
        // const doc = new jsPDF();
        // let y = 10; // Starting Y position
        
        // // Format and add rows
        // data.sheets[0].data[0].rowData.forEach((row: any) => {
        //   const values = row.values.map((cell: any) => cell.formattedValue || '').join(' | ');
        //   doc.text(values, 10, y);
        //   y += 10;
        // });
      
        // doc.save('Spreadsheet.pdf');
    }
}

function skillsCellRenderer(params: ICellRendererParams) {
    const data = params.data;
    const skills: string[] = [];
    RefData.IT_SKILLS.forEach(function(skill) {
        if (data && data.skills && data.skills[skill]) {
            skills.push(`<img src="images/skills/${skill}.png" width="16px" title="${skill}" />`);
        }
    });
    return skills.join(' ');
}

function countryCellRenderer(params: ICellRendererParams) {
    return `<img border='0' width='15' height='10' style='margin-bottom: 2px' src='images/flags/${RefData.COUNTRY_CODES[params.value]}.png'>${params.value}`;
}

function createRandomPhoneNumber() {
    let result = '+';
    for (let i = 0; i < 12; i++) {
        result += Math.round(Math.random() * 10);
        if (i === 2 || i === 5 || i === 8) {
            result += ' ';
        }
    }
    return result;
}

function percentCellRenderer(params: ICellRendererParams) {
    const value = params.value;

    const eDivPercentBar = document.createElement('div');
    eDivPercentBar.className = 'div-percent-bar';
    eDivPercentBar.style.width = value + '%';
    if (value < 20) {
        eDivPercentBar.style.backgroundColor = 'red';
    } else if (value < 60) {
        eDivPercentBar.style.backgroundColor = '#ff9900';
    } else {
        eDivPercentBar.style.backgroundColor = '#00A000';
    }

    const eValue = document.createElement('div');
    eValue.className = 'div-percent-value';
    eValue.innerHTML = value + '%';

    const eOuterDiv = document.createElement('div');
    eOuterDiv.className = 'div-outer-div';
    eOuterDiv.appendChild(eValue);
    eOuterDiv.appendChild(eDivPercentBar);

    return eOuterDiv;
}

// Utility function used to pad the date formatting.
function pad(num: number, totalStringSize: number) {
    let asString = num + '';
    while (asString.length < totalStringSize) { asString = '0' + asString; }
    return asString;
}

