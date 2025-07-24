import { Component, ElementRef, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserService } from '@services/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from './user.model'
import { CompanyService } from '@services/company.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { PermissionService } from 'src/app/shared/auth/permssion.guard';
import { GoogleSheetsService } from '@services/google-sheet/google-sheets.service';
import { GoogleAuthService } from '@services/auth/google-auth.service';
import { Router } from '@angular/router';
import {jsPDF} from 'jspdf';
import { lastValueFrom } from 'rxjs';
// import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';


// Import the font file
import { vfs } from '../../../../assets/vfs_fonts';

(pdfMake as any).vfs = vfs;
pdfMake.fonts = {
  NotoSansGujarati: {
    normal: 'NotoSansGujarati.ttf',
    bold: 'NotoSansGujarati-Bold.ttf',
  },
  helvetica: {
    normal: 'helvetica.ttf',
    bold: 'helvetica-Bold.ttf',
  },
};
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent {
  @ViewChild('session_expired', { static: true }) sessionTemplate!: TemplateRef<any>;
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  isDeleteButtonClicked = false;
  isImportButtonClicked = false;
  userHeader = [];
  userArray = [];
  statusArray = [{ "key": "Active" },
  { "key": "InActive" }]
  modelRef: NgbModalRef;
  edituserId: string;
  companyId: string;
  deletedUserId: string;
  // search: string = '';
  companyNamesObj: any = [];
  public isLoading: boolean = true;
  locations: any = [];
  selectedFile: File | null = null;

  @Input('data') meals: string[] = [];
  imageUploadstatus: boolean = false;
  fileName: string;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpages: number = 1;
  TotalCount:number = 0;
  Objectfilter:Object={};
  sortField: string = 'emp_id'; // Default sort field
  // sortDirection:string = 'asc'; // Default sort direction
  selectedCompany: any = null; // Initialize selectedCompany with null
  selectedLocation: any = null; // Initialize selectedLocation with null
  selectedStatus: any = null;
  activeuploadbutton:boolean= false;

  loggedIn = false;
  userName: string | null = '';

  public columnControl = {
    ID: false,
    MemberName: true,
    Firstname: false,
    Middlename: false,
    Lastname: false,
    Mobile: false,
    Address: false,
    Location: false,
    Email: false,
    MarriageStatus: false,
    BirthDate: false,
    Gautra: false,
    KYC: false,
    // Add more controls as needed
  };

  // Define which columns can be sorted
  sortableColumns: { [key: string]: boolean } = {
    ID: false,
    MemberName: true,
    Firstname: true,
    Middlename: true,
    Lastname: true,
    Mobile: false,
    Address: false, // Example: Address column is not sortable
    Location: true,
    Email: false,
    MarriageStatus: false,
    BirthDate: false,
    Gautra: false,
    KYC: false
  };

  // Control which columns have a search box
  searchableColumns = {
    ID: false,
    MemberName: false,
    Firstname: true,
    Middlename: true, // Example: Middlename search box is hidden
    Lastname: false,
    Mobile: false,
    Address: false,
    Location: false,
    Email: false,
    MarriageStatus: false, // Example: MarriageStatus search is disabled
    BirthDate: false,
    Gautra: false,
    KYC: false
  };
  searchValues: { [key: string]: string } = {};
  activeSearch: string | null = null;
  isSearchActivate: boolean = false;

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = 'asc';
  
  // yearColumnHeader;
  nonYearColumnCount = 15;
  receiptEditData: any = {};

  columnControlSelectAll = false;
  sortableColumnsSelectAll = false;
  searchableColumnsSelectAll = false;

  languages: any = ['Gujarati', 'Hindi', 'English'];
  languageControl: any = {
    Gujarati: false, 
    Hindi: false, 
    English: true, 
  };

  gujUserArray: any = [];
  selectedLanguage = 'English';
  maxReceipt = 0;
  currentYear = new Date().getFullYear(); // 2027
  showNumberOfYears = 3;
  activeYearColumns = [];


  constructor
    (
      private userService: UserService,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private companyService: CompanyService,
      private http: HttpClient,
      private router: Router,
      private sheetsService: GoogleSheetsService,
      public gAuthService: GoogleAuthService,
      private permissionService: PermissionService

    ) {


  }

  getSelectedLanguage(message: string) {
    this.selectedLanguage = message;
  }

  ngOnInit(): void {
    if (localStorage.getItem('columnControl')) this.columnControl = JSON.parse(localStorage.getItem('columnControl'));
    if (localStorage.getItem('sortableColumns')) this.sortableColumns = JSON.parse(localStorage.getItem('sortableColumns'));
    if (localStorage.getItem('searchableColumns')) this.searchableColumns = JSON.parse(localStorage.getItem('searchableColumns'));
    
    // setTimeout(_ => {
      this.isLoading = false;
    // }, 2000);
    this.gAuthService.isLoggedIn$.subscribe(
      (loggedIn) => {
       this.checkAuthStatus();
      }
    );
  }

  // toggleLanguage() {
  //   this.selectedLanguage = this.selectedLanguage === 'English' ? 'Gujarati' : 'English';
  // }

  // setLanguage(language: string) {
  //   this.selectedLanguage = language;
  // }
  
  isAdmin() {
    let email = localStorage.getItem('email');
    if (email.includes('ajay')) {
      return true;
    } else {
      return false
    }
  }

  manageColumn() {

    // console.log('userHeader:', this.userHeader);
    let baseConfig;
    baseConfig = this.userHeader.reduce((config, column) => {
      config[column] = column === 'MemberName' ? true : false;
      // config[column] = column === 'Mobile' ? true : false;    // -----------temp activated for testing
      return config;
    }, {});

    this.columnControl = Object.assign({}, baseConfig);
    this.sortableColumns = Object.assign({}, baseConfig);
    this.searchableColumns = Object.assign({}, baseConfig);

    this.columnControl['MemberName'] = true;
    this.sortableColumns['MemberName'] = true;
    this.searchableColumns['MemberName'] = false;

    // keep current year active/visible
    if (this.activeYearColumns) {
      this.activeYearColumns.forEach(year => {
        this.columnControl[year.header] = true;
        this.sortableColumns[year.header] = true;

      });
      // this.columnControl[this.currentYear-1] = true;
      // this.columnControl[this.currentYear-0] = true;
      // this.sortableColumns[this.currentYear-1] = true;
      // this.sortableColumns[this.currentYear-0] = true;
    }
    this.preserveState();
    // console.log('searchableColumns:', this.searchableColumns);
    // localStorage.setItem('srch', JSON.stringify(this.searchableColumns));
    // console.log('baseConfig:', baseConfig);
  }

  preserveState() {
    localStorage.setItem('columnControl', JSON.stringify(this.columnControl));
    localStorage.setItem('sortableColumns', JSON.stringify(this.sortableColumns));
    localStorage.setItem('searchableColumns', JSON.stringify(this.searchableColumns));
  }
  
  checkAuthStatus() {
    if(this.gAuthService.getToken) {
      console.log('user logged in fetching sheet data');
      this.fetchSheetData('sheet1');
      // this.fetchGujSheetData('sheet2');
      this.isAdmin();
    } else {
      console.log('user --not---- logged in');
      }
  }

  // enableSearch() {
  //   this.isSearchActivate = !this.isSearchActivate;
  //   this.resetSearch();
  // }

  getMaxReceipt() {
    let max = 0;
    this.userArray.forEach(row => {
      max = max > Number(row[this.nonYearColumnCount + 0]) ? max : row[this.nonYearColumnCount + 0];
      max = max > Number(row[this.nonYearColumnCount + 1]) ? max : row[this.nonYearColumnCount + 1];
      max = max > Number(row[this.nonYearColumnCount + 2]) ? max : row[this.nonYearColumnCount + 2];
      max = max > Number(row[this.nonYearColumnCount + 3]) ? max : row[this.nonYearColumnCount + 3];
      max = max > Number(row[this.nonYearColumnCount + 4]) ? max : row[this.nonYearColumnCount + 4];
    });
    return max;
  }

  manageSearch() {
    this.isSearchActivate = false;
    var allTrue = Object.keys(this.searchableColumns).filter((k) => {
      // console.log(this.searchableColumns[k], k)
      if (this.searchableColumns[k] === true) {
        if (this.columnControl[k] === true) {
          // console.log('There is true value:', k);
          this.isSearchActivate = true;
          return k;
        }
      }
      return false;
    });
    if (!allTrue.length) this.resetSearch();
  }

  checkTogglesState() {
    let view = localStorage.getItem('columnControl') == JSON.stringify(this.columnControl);
    let sort = localStorage.getItem('sortableColumns') == JSON.stringify(this.sortableColumns);
    let search = localStorage.getItem('searchableColumns') == JSON.stringify(this.searchableColumns);
    if (view && sort && search) return true;
    else return false;
  }

  fetchSheetData(sheetname) {
    this.sheetsService.getSheetData(sheetname).subscribe({
      next: (res: any) => {
        if (res) {
          this.userHeader = res.values[0] || [];
          this.userArray = res.values.slice(1) || [];
          this.sheetsService.userData = res.values;
          // console.log('Fetched Data:', res, this.userArray, this.userHeader);
          // this.userArray = res.values || [];
          this.TotalCount = res.values.lenght;

          // Initialize search values for each column
          this.userHeader.forEach(header => {
            this.searchValues[header] = '';
          });
          this.searchValues['MemberName'] = '';
          this.getActiveYearHeaders(this.showNumberOfYears);
          if (!localStorage.getItem('columnControl') || this.checkTogglesState()) {
            this.manageColumn();
          }
          // this.yearColumnHeader = this.sheetsService.userData[0].slice(this.nonYearColumnCount).filter(ud => {
          //   return ud;
          // });
          this.maxReceipt = this.getMaxReceipt();
        }
      },
      error: (error) => {
        this.toastr.error('Error fetching sheet data:', error);
        this.openVerticallyCentered(this.sessionTemplate);
        // alert('user logout');
      }
    });
  }

  getActiveYearHeaders(count) {
    this.activeYearColumns = [];
    this.sheetsService.userData[0].forEach((h, i) => {
      for (let index = count; index >= 0; index--) {
        if ((this.currentYear - index) == Number(h)) {
          this.activeYearColumns.push({'header': h, 'index': i});
        }
      }
    });
    console.log('activeYear: ', this.activeYearColumns);
  }

  fetchGujSheetData(sheetname) {
    this.sheetsService.getSheetData(sheetname).subscribe({
      next: (res: any) => {
        if (res) {
          // this.userHeader = res.values[0] || [];
          this.gujUserArray = res.values.slice(1) || [];
          // this.sheetsService.userData = res.values;
          // console.log('Fetched Data:', res);
          // this.userArray = res.values || [];
          this.TotalCount = res.values.lenght;
        }
      },
      error: (error) => {
        this.toastr.error('Error fetching sheet data:', error);
        this.openVerticallyCentered(this.sessionTemplate);
        // alert('user logout');
      }
    });
  }

  hasPermission(modules,accestype): boolean {
    return this.permissionService.hasPermission(modules,accestype);
  }

  conditionallyShowCellData(cell, colId?: number) {
    // year columns
    if (colId && colId >= this.nonYearColumnCount) {
      if(!cell && cell !== 0) {
        return 'N/A';
      } else if (cell == 111) {
        return 'Senior';
      } else if (cell == 222) {
        return 'New';
      }
    }
    // mobile number column - return object with link info
    if (colId && colId === 4) {
      if (cell && cell.length == 10) {
        return {
          text: "+91 " + cell.slice(0, 10),
          isLink: true,
          value: cell
        };
      }
    }
    return cell;
  }
  // onTableDataChange(event: any) {
  //   this.currentPage = event;
  //   this.isLoading = true;
  //   this.filterUsers();
  // }

  // onTableSizeChange(event: any): void {
  //   this.isLoading = true;
  //   this.itemsPerPage = event.target.value;
  //   this.currentPage = 1;
  //   this.filterUsers();

  // }

  // getUsers(page?: number, limit?: number): void {
    
  //   this.userService.getUsers(page, limit).subscribe({
  //     next: (res: any) => {
  //       if (res.success === 1) {
  //         this.userArray = res.data.users || [];
  //         this.TotalCount = res.data.totalCount;
  //       }
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.error.message);
  //     }
  //   });
  // }

  // getLocations(): void {
  //   this.userService.getLocations().subscribe({
  //     next: (res: any) => {
  //       if (res.success === 1) {
  //         this.locations = (res.data || []).filter(x => x != null);
  //       } else {
  //         this.toastr.error(res.error.message);
  //       }
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.error.message);
  //     }
  //   });
  // }

  // getCompanyList(): void {
  //   this.companyService.getCompanyList().subscribe({
  //     next: (res: any) => {
  //       if (res.success === 1) {
  //         this.companyNamesObj = res.data || [];
  //       } else {
  //         this.toastr.error(res.error.message);
  //       }
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.error.error);
  //     }
  //   });
  // }
  edituser(userdata: any, template: TemplateRef<any>) {
    this.edituserId = userdata[0];
    // this.companyId = userdata.company_id;
    this.openVerticallyCentered(template)
  }

  editReceiptNumber(user, colId, rowId, content: TemplateRef<any>) {
    if (colId < this.nonYearColumnCount) return;
    this.receiptEditData = {
      user: user,
      headerEdit: this.userHeader[colId],
      cellValue: user[colId],
      colId: colId,
      rowId: rowId 
    }
    console.log('cellId',user, this.userHeader[colId],user[colId], colId, rowId);
    // this.deletedUserId = userId;
    // user[colId] = '8888';
    // console.log('after edit',user, this.userHeader[colId],user[colId], colId, rowId);
    this.modelRef = this.modalService.open(content, { centered: true })
  }

  async saveReceiptData() {
    this.isLoading = true;
    this.receiptEditData.user[this.receiptEditData.colId] = this.receiptEditData.cellValue == null ? '' : this.receiptEditData.cellValue;
    console.log('receiptEditData: ', this.receiptEditData);
    // this.userArray[this.receiptEditData.rowId-1][this.receiptEditData.colId] = this.receiptEditData.user[this.receiptEditData.colId];
    // console.log(this.userArray[this.receiptEditData.rowId-1][this.receiptEditData.colId]);
    // console.log('this.userArray:', this.userArray);
    // console.log('updated user is: ', this.receiptEditData.user);
    // update sheet data
    let rawAddress = parseInt(this.receiptEditData.user[0]) + 1;
    await this.updateSheetData('A'+rawAddress, this.receiptEditData.user);
    // clear variables
    Object.keys(this.receiptEditData).forEach(key => {
      delete this.receiptEditData[key];
    })
    // console.log('after cleaer is: ', this.receiptEditData);
    // fetch sheet data
    // await this.fetchSheetData('sheet1');
    // this.getMaxReceipt();
    this.isLoading = false;
    this.modelRef.dismiss();

  }


  async updateSheetData(rowAddress,userData) {
    try {
        const response = await lastValueFrom(this.sheetsService.updateSheetData('Sheet1', rowAddress, [userData]));
        console.log('Sheet updated successfully:', response);
        this.toastr.success('User Updated successfully!', 'Success');
      } catch (error) {
        console.error('Error updating sheet data:', error);
        throw error;
      }
  }

  closeModal() {
    this.edituserId = undefined;
    this.modelRef.dismiss();
    this.imageUploadstatus = false;
    this.selectedFile = null;
    // this.getLocations();
    console.log(this.activeSearch, this.searchValues);
    this.filterUsers();
    this.checkAuthStatus();

  }
  ontryagain(){
    this.imageUploadstatus = false;
    this.selectedFile = null;
  }
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modelRef = this.modalService.open(content, { centered: true })
  }

  openVerticallyCentered1(Id: any, content: TemplateRef<any>) {
    this.edituserId = Id;
    this.isLoading = true;
    setTimeout(() => {
      this.modelRef = this.modalService.open(content, { centered: true });
      this.isLoading = false;
    }, 2000);
  }

  openVerticallyCentered2(userId: string, content: TemplateRef<any>) {
    this.deletedUserId = userId;
    this.modelRef = this.modalService.open(content, { centered: true })
  }

  deleteUser(userId: string): void {
    console.log('delete user: ', userId);
    this.isDeleteButtonClicked = true;
    // this.userService.deleteUser(userId).subscribe({
    //   next: (response: any) => {
    //     if (response.success === 1) {
    //       this.toastr.success(response.message, 'Success');
    //       setTimeout(() => {
    //         this.isLoading = false;
    //       }, 1000);
    //       this.filterUsers();
    //       this.modelRef.dismiss();
    //     } else {
    //       this.toastr.error(response.error.message);
    //     }
    //     this.isDeleteButtonClicked = false;
    //   },
    //   error: (error) => {
    //     this.isDeleteButtonClicked = false;
    //     this.toastr.error(error.error.error);
    //   }
    // });
  }



  filterUsers() {
    this.Objectfilter['page'] = this.currentPage;
    this.Objectfilter['limit'] = this.itemsPerPage;
    // this.Objectfilter['search'] = this.search;
    // this.userService.filterUsers(this.Objectfilter).subscribe({
    //   next: (res: any) => {
    //     if (res.success === 1) {
    //       setTimeout(() => {
    //         this.isLoading = false;
    //       }, 1000);
    //       this.userArray = res.data.users || [];
    //       this.TotalCount = res.data.totalCount;
    //       this.totalpages = res.data.totalpages;
    //     } else {
    //       this.toastr.error(res.message);
    //       this.isLoading = false;
    //     }
    //   },
    //   error: (error) => {
    //     this.toastr.error(error.error.error);
    //     this.isLoading = false;
    //   }
    // });
  }

  // filterUserBySearch() {
  //   this.currentPage =1;
  //   this.filterUsers();
  // }

  // onLocationChange(location: string) {
  //   this.Objectfilter['location'] = location;
  //   this.Objectfilter['page'] =1;
  //   this.currentPage =1
  //   this.filterUsers();
  // }

  // onCompanyChange(comObj: any) {
  //   this.Objectfilter['company_id'] = comObj ? comObj._id:null;
  //   this.Objectfilter['page'] =1;
  //   this.currentPage =1
  //   this.filterUsers();
  // };

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const validFileTypes = ['text/csv', 'application/vnd.ms-excel']; // Mime types for CSV files

      if (!validFileTypes.includes(this.selectedFile.type)) {
        this.toastr.error('Only CSV files are allowed.' );
        event.target.value = ''; // Reset the file input
        this.activeuploadbutton = false;
        this.fileName = '';
        return;
      }
      this.activeuploadbutton = true;
      this.imageUploadstatus = true;
      this.fileName = this.selectedFile.name;
    }
  };

  // async exportUser() {
  //   if (!this.selectedFile) {
  //     console.error('No file selected.');
  //     this.toastr.error('Please select a CSV file.');
  //     return;
  //   }

  //   this.isImportButtonClicked = true;

  //   this.userService.importUsers(this.selectedFile).subscribe({
  //     next: (res: any) => {
  //       if (res.success === 1) {
  //         this.toastr.success(res.message, 'Success');
  //         this.getUsers(this.currentPage, this.itemsPerPage);
  //         this.closeModal();
  //         this.isImportButtonClicked = false;
  //       } else {
  //         this.toastr.error(res.error.message);
  //         this.isImportButtonClicked = false;
  //       }
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.error.error);
  //       this.isImportButtonClicked = false;
  //     }
  //   });
  // }

  // onstatuschange(status: string) {
  //   this.Objectfilter['status'] = status ? status["key"] : null;
  //   this.Objectfilter['page'] =1;
  //   this.currentPage =1
  //   this.filterUsers();
  // }
  // onsort(){
  //   this.sortDirection = this.sortDirection === 'asc' ? 'asc' :'desc';
  //   this.Objectfilter['sort'] =this.sortDirection;
  //   this.sortDirection = this.sortDirection === 'asc' ? 'desc' :'asc';
  //   this.userArray.reverse();
  //   // this.filterUsers();
  // }

  // calculateIndex(indexOnPage: number): number {
  //   return (this.currentPage - 1) * this.itemsPerPage + indexOnPage + 1;
  // }
  // downloadFile() {
  //   const url = '../../../assets/empfffcsv.csv'; // Replace with your server endpoint for downloading the file
  //   this.http.get(url, { responseType: 'blob' }).subscribe((data: any) => {
  //     const blob = new Blob([data], { type: 'application/octet-stream' });
  //     const link = document.createElement('a');
  //     link.href = window.URL.createObjectURL(blob);
  //     link.download = 'demo.csv'; // Change the file name as needed
  //     link.click();
  //   });
  // }
  // clearFilters() {
  //   this.search = '';
  //   this.selectedCompany = null;
  //   this.selectedLocation = null;
  //   this.selectedStatus = null;
  //   this.Objectfilter = {};
  //   this.currentPage = 1;
  //   this.itemsPerPage = 10;
  //   this.getUsers(this.currentPage, this.itemsPerPage);
  // }

  public async logout(): Promise<void> {
    this.gAuthService.logout();
    localStorage.clear();
    this.modelRef.dismiss();
    window.location.reload();
  }

  selectDeselectCube() {
    let setToggleValue = false;
    if(this.columnControlSelectAll && this.sortableColumnsSelectAll && this.searchableColumnsSelectAll) {
      setToggleValue = true;
    }
    this.columnControlSelectAll = !setToggleValue; 
    this.sortableColumnsSelectAll = !setToggleValue;  
    this.searchableColumnsSelectAll = !setToggleValue; 
    this.selectDeselectAll(event, 'columnControl');
    this.selectDeselectAll(event, 'sortableColumns');
    this.selectDeselectAll(event, 'searchableColumns');
  }

  public selectDeselectAll(event: Event, controls: string) {
    // const input = event.target as HTMLInputElement;  // Type assertion here
    // const isChecked = input.checked;
    // console.log('event:',event);
    for (const key in this[controls]) {
      if (key != 'MemberName' || (key == 'MemberName' && controls == 'searchableColumns')) {
        this[controls][key] = this[controls+'SelectAll'];
      }
    }
    if (controls == 'columnControl' || controls == 'searchableColumns') {
      this.manageSearch();
    }
    // this.preserveState();
  }

  selectDeselectRow(row) {
    let setToggleValue = false;
    if(this.columnControl[row] && this.sortableColumns[row] && this.searchableColumns[row]) {
      setToggleValue = true;
    }
    this.columnControl[row] = !setToggleValue;
    this.sortableColumns[row] = !setToggleValue;
    this.searchableColumns[row] = !setToggleValue;
    this.manageSearch();
    // this.preserveState();
  }

  sortTable(column: string) {
    if (!this.sortableColumns[column]) {
      return;
    }
    const columnIndex = this.userHeader.indexOf(column);

    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column and default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Perform the sort
    this.userArray.sort((a, b) => {
      if (column === 'MemberName') {
        // Composite sorting for MemberName
        const fullNameA = `${a[this.userHeader.indexOf("Firstname")]} ${a[this.userHeader.indexOf('Middlename')]} ${a[this.userHeader.indexOf('Lastname')]}`
          .trim()
          .toLowerCase();
        const fullNameB = `${b[this.userHeader.indexOf('Firstname')]} ${b[this.userHeader.indexOf('Middlename')]} ${b[this.userHeader.indexOf('Lastname')]}`
          .trim()
          .toLowerCase();
        return this.compareValues(fullNameA, fullNameB);
      } else {
        return this.compareValues(a[columnIndex], b[columnIndex]);
      }
    });
  }

  compareValues(a: string | undefined, b: string | undefined): number {
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    // Handle empty cells
    if (!a && !b) return 0;
    if (!a) return 1 * direction;
    if (!b) return -1 * direction;

    // Convert to lowercase for case-insensitive sorting
    const lowerA = a.toString().toLowerCase();
    const lowerB = b.toString().toLowerCase();

    // Handle numeric sorting if both are numbers
    const numA = parseFloat(lowerA);
    const numB = parseFloat(lowerB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return (numA - numB) * direction;
    }

    // Default to string comparison
    return lowerA.localeCompare(lowerB) * direction;
  }

  // filterUserBySearch() {
  //   const query = this.search.toLowerCase();
  //   this.activeSearch = 'combine';

  //   // Reset the table if the search value is empty
  //   if (!query) {
  //     this.resetSearch();
  //     return;
  //   }

  //   this.userArray = this.sheetsService.userData.slice(1).filter(user => 
  //     user[1].toLowerCase().includes(query) ||
  //     user[2].toLowerCase().includes(query) ||
  //     user[3].toLowerCase().includes(query) ||
  //     user[4].toLowerCase().includes(query) ||
  //     user[5].toLowerCase().includes(query) ||
  //     user[7].toLowerCase().includes(query)
  //   );
  // }

  onSearch(column: string, event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Cast to HTMLInputElement
    // Disable other search boxes and wipe their values
    this.userHeader.forEach(header => {
      if (header !== column) {
        this.searchValues[header] = '';
      }
    });
    if (column !== 'MemberName') {
      this.searchValues['MemberName'] = '';
    }
  
    this.activeSearch = column;
  
    // Reset the table if the search value is empty
    if (!value) {
      this.resetSearch();
      return;
    }
    if (column === 'MemberName') {
      // Special handling for "MemberName"
      const firstNameIndex = this.userHeader.indexOf('Firstname');
      const middleNameIndex = this.userHeader.indexOf('Middlename');
      const lastNameIndex = this.userHeader.indexOf('Lastname');
  
      if (firstNameIndex === -1 || middleNameIndex === -1 || lastNameIndex === -1) {
        console.error('One or more indices for MemberName are missing in userHeader');
        return;
      }
  
      this.userArray = this.sheetsService.userData.slice(1).filter(row => {
        const fullName = `${row[firstNameIndex] || ''} ${row[middleNameIndex] || ''} ${row[lastNameIndex] || ''}`.trim().toLowerCase();
        return fullName.includes(value);
      });
    } else {
      // General search logic
      const columnIndex = this.userHeader.indexOf(column);
      if (columnIndex === -1) {
        console.error(`Column "${column}" not found in userHeader`);
        return;
      }
  
      this.userArray = this.sheetsService.userData.slice(1).filter(row => {
        const cellValue = (row[columnIndex] || '').toLowerCase();
        return cellValue.includes(value);
      });
    }
  }
  
  resetSearch() {
    this.userArray = [...this.sheetsService.userData.slice(1)];
    this.activeSearch = null;
  }

  generateData1(hdr, data) {
    var result = [];
    var printData = {};
    for (var i = 0; i < data.length; i++) {
      printData['#'] = (i + 1).toString();
      if (this.selectedLanguage == 'English') printData['Member Name'] = data[i][1] + ' ' + data[i][2] + ' ' + data[i][3];
      else 
      console.log('Row ['+i+']: ',data[i][12] + ' ' + data[i][13] + ' ' + data[i][14]);
      printData['Member Name'] = data[i][12] + ' ' + data[i][13] + ' ' + data[i][14];
      printData['2022'] = data[i][this.nonYearColumnCount + 0] || 'N/A';
      printData['2023'] = data[i][this.nonYearColumnCount + 1] || 'N/A';
      printData['2024'] = data[i][this.nonYearColumnCount + 2] || 'N/A';
      printData['2025'] = data[i][this.nonYearColumnCount + 3] || 'N/A';
      printData['2026'] = data[i][this.nonYearColumnCount + 4] || 'N/A';
      result.push(Object.assign({}, printData));
    }

    return result;
  };
  
  createHeaders(keys) {
    var result = [];

    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 65,
        // align: "center",
        padding: 0
      });
    }
    return result;
  }
  
  // downloadAsPDF2() {
  //   var hdr = [...[
  //       "#",
  //       "Member Name",
  //     ]
  //     , ...this.yearColumnHeader
  //   ];
  //   var headers = this.createHeaders(hdr);
    
  //   var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "portrait" });
  //   doc.setFontSize(28);
  //   doc.addFont("../../../../assets/fonts/NotoSansGujarati.ttf","NotoSansGujarati","normal");
  //   doc.setFont("NotoSansGujarati", "normal");
  //   // if (this.selectedLanguage == 'English') {
  //   //   doc.setFont("helvetica", "bold");
  //   // } else {
  //   // }

  //   doc.text(this.userArray[1][12], 105, 15,  null, "center");
  //   // doc.text("This is centred text.", 105, 80, null, null, "center");
  //   doc.table(10, 20, this.generateData(this.userArray), headers, { autoSize: true, headerTextColor: 'red', headerBackgroundColor: 'yellow' });
  //   doc.save('FilteredTable.pdf');
  // }
  
  

  // downloadAsPDF3() {
  //   const hdr = ["#", "Member Name", ...this.yearColumnHeader];
  //   const headers = this.createHeaders(hdr);
  //   const rows = this.generateData( this.userArray);
  
  //   const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "portrait" });
  //   doc.setFontSize(28);
  //   doc.addFont("../../../../assets/fonts/NotoSansGujarati.ttf", "NotoSansGujarati", "normal");
  //   doc.setFont("NotoSansGujarati", "normal");
  
  //   // Title
  //   doc.text("ભીખુભાઈ કૈલાશચંદ્ર ગુપ્તા", 105, 15, null, "center");
  
  //   // Add table
  //   // doc.autoTable({
  //   //   head: [headers],
  //   //   body: rows,
  //   //   styles: { font: "NotoSansGujarati", fontStyle: "normal" },
  //   // });
  
  //   doc.save('FilteredTable.pdf');
  // }



  // public downloadAsPDF1(): void {
  //   const doc = new jsPDF({
  //     orientation: 'landscape',
  //     putOnlyUsedFonts: true,
  //     // unit: 'px',
  //     // format: 'a4',
  //   });
  
  //   const pdfTable = this.pdfTable.nativeElement;
  
  //   // Clone table and make it visible
  //   const clonedTable = pdfTable.cloneNode(true) as HTMLElement;
  //   clonedTable.style.overflow = 'visible';
  //   clonedTable.style.maxHeight = 'none';
  //   clonedTable.style.display = 'block'; // Ensure visibility
  //   document.body.appendChild(clonedTable);
  
  //   doc.html(clonedTable, {
  //     callback: (doc) => {
  //       doc.save('FilteredTable.pdf');
  //       document.body.removeChild(clonedTable); // Clean up
  //     },
  //     x: 15,
  //     y: 15,
  //     html2canvas: {
  //       scale: 0.25, // High resolution
  //       useCORS: true, // Handle cross-origin resources
  //     },
  //   });
  // }


  generateData(data) {
    let tableData = data.map((row, index) => {
      console.log('row data: ----0',row[this.nonYearColumnCount + 0])
      console.log('row data: ----1',row[this.nonYearColumnCount + 1])
      console.log('row data: ----2',row[this.nonYearColumnCount + 2])
      console.log('row data: ----3',row[this.nonYearColumnCount + 3])
      console.log('row data: ----4',row[this.nonYearColumnCount + 4])
      let memberData = '';
      if (this.selectedLanguage == 'English') memberData = `${row[1]} ${row[2]} ${row[3]}`;
      else memberData = `${row[12]} ${row[13]} ${row[14]}`;
      return [
        {text: (index + 1).toString(), style: 'tableData'}, // #
        {text: memberData, style: 'tableData'}, // Member Name
        {text: this.conditionallyShowCellData(row[this.nonYearColumnCount + 0], this.nonYearColumnCount), style: 'tableData'}, // 2022
        {text: this.conditionallyShowCellData(row[this.nonYearColumnCount + 1], this.nonYearColumnCount), style: 'tableData'}, // 2023
        {text: this.conditionallyShowCellData(row[this.nonYearColumnCount + 2], this.nonYearColumnCount), style: 'tableData'}, // 2024
        {text: this.conditionallyShowCellData(row[this.nonYearColumnCount + 3], this.nonYearColumnCount), style: 'tableData'}, // 2025
        {text: this.conditionallyShowCellData(row[this.nonYearColumnCount + 4], this.nonYearColumnCount), style: 'tableData'}, // 2026
      ];
    });
    return tableData;
  }
  
  downloadAsPDF() {
    // ref: https://www.npmjs.com/package/pdfmake
  //   var hdr1 = [...[
  //     "#",
  //     "Member Name",
  //   ]
  //   , ...this.yearColumnHeader
  // ];
  // var headers = this.createHeaders(hdr1);



    // Table headers
    const hdr = [
      {text: '#', style: 'tableHeader'}, 
      {text: this.selectedLanguage == 'English' ? 'Member Name' :'સદસ્યોના નામ', style: 'tableHeader'}, 
      {text: '2022', style: 'tableHeader'}, 
      {text: '2023', style: 'tableHeader'}, 
      {text: '2024', style: 'tableHeader'}, 
      {text: '2025', style: 'tableHeader'}, 
      {text: '2026', style: 'tableHeader'}
    ];
  
    // Generate data for the table
    const tableBody = [hdr, ...this.generateData(this.userArray)];
  
    // Document definition for pdfMake
    const docDefinition = {
      content: [
        {
          stack: [
          this.selectedLanguage == 'English' ? 'Mathur Vyshy Shakha Sabha, Anand' :'માથુર વૈશ્ય શાખા સભા, આણંદ',
          // {text: 'This is a subheader', style: 'subheader'},
          ],
          style: 'header'
        },
        // { text: this.selectedLanguage == 'English' ? 'Mathur Vyshy Anand Shakha Sabha' :'માથુર વૈશ્ય આણંદ શાખા સભા', fontSize: 16, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        { text: this.selectedLanguage == 'English' ? 'Last Added: '+this.maxReceipt  : 'પાછલી રસીદ નં: '+this.maxReceipt, fontSize: 10, bold: false, alignment: 'right', margin: [0, 10, 0, 10] },
        {
          table: {
            headerRows: 1,
            body: tableBody,
          },
          style: 'tableExample',
          layout: 'lightHorizontalLines', // Optional table styling
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 15, 0, 0]
        },
        tableExample: {
          margin: [20, 5, 0, 10],
          // alignment: 'center',
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          margin: [3, 3, 3, 3]
        },
        tableData: {
          bold: true,
          // fontSize: 12,
          color: 'black',
          margin: [3, 3, 3, 3]
        }
      },
      defaultStyle: {
        font: this.selectedLanguage == 'English'? 'helvetica' : 'NotoSansGujarati', // Set default font to Gujarati
      },
    };
  
    // const fileName = `${new Date().getDate().toString().padStart(2,'0')}-${(new Date().getMonth()+1).toString().padStart(2,'0')}-${new Date().getFullYear()}-${new Date().getHours().toString().padStart(2,'0')}-${new Date().getMinutes().toString().padStart(2,'0')}`;
    const fileName = `MvAnand_${new Date().getDate().toString().padStart(2,'0')}-${(new Date().getMonth()+1).toString().padStart(2,'0')}-${new Date().getFullYear()}`;
    // Generate and download the PDF
    pdfMake.createPdf(docDefinition).download(fileName+'.pdf');
  }

public async downloadTranscriptFast() {
  const table = document.getElementById('transcript_inner') as HTMLElement;
  if (!table) return;
  this.isLoading = true;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const thead = table.querySelector('thead') as HTMLElement;
  const tbody = table.querySelector('tbody') as HTMLElement;
  const rows = Array.from(tbody.querySelectorAll('tr')) as HTMLElement[];

  // Helper to render an element to canvas
  const renderToCanvas = async (element: HTMLElement) => {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    return canvas;
  };

  // 1. Measure thead height (if present)
  let theadHeight = 0;
  if (thead) {
    const theadCanvas = await renderToCanvas(thead);
    theadHeight = (theadCanvas.height * pdfWidth) / theadCanvas.width;
  }

  // 2. Measure single row height
  let rowHeight = 0;
  if (rows.length > 0) {
    const tempTable = document.createElement('table');
    tempTable.style.width = table.style.width || '100%';
    if (thead) tempTable.appendChild(thead.cloneNode(true));
    const tbodyClone = document.createElement('tbody');
    tbodyClone.appendChild(rows[0].cloneNode(true));
    tempTable.appendChild(tbodyClone);
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    document.body.appendChild(tempTable);
    const rowCanvas = await renderToCanvas(tempTable);
    rowHeight = (rowCanvas.height * pdfWidth) / rowCanvas.width - theadHeight;
    document.body.removeChild(tempTable);
  }

  // 3. Calculate rows per page
  const rowsPerPage = rowHeight > 0 ? Math.floor((pdfHeight - theadHeight) / rowHeight) : rows.length;

  // 4. Batch process rows
  let i = 0;
  while (i < rows.length) {
    const batchRows = rows.slice(i, i + rowsPerPage);

    // Create batch container
    const container = document.createElement('table');
    container.style.width = table.style.width || '100%';
    if (thead) container.appendChild(thead.cloneNode(true));
    const tbodyClone = document.createElement('tbody');
    batchRows.forEach(row => tbodyClone.appendChild(row.cloneNode(true)));
    container.appendChild(tbodyClone);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Render and add to PDF
    const canvas = await renderToCanvas(container);
    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

    document.body.removeChild(container);

    if (i + rowsPerPage < rows.length) pdf.addPage();
    i += rowsPerPage;
  }

  pdf.save('Transcript.pdf');
  this.isLoading = false;
}  

  public async downloadTranscriptNoGaps() {
    const table = document.getElementById('transcript_inner') as HTMLElement;
    if (!table) return;
    this.isLoading = true;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let currentY = 0;

    const thead = table.querySelector('thead') as HTMLElement;
    const tbody = table.querySelector('tbody') as HTMLElement;
    const rows = Array.from(tbody.querySelectorAll('tr')) as HTMLElement[];

    // Helper to render a batch of rows
    const renderBatch = async (rows: HTMLElement[], includeThead: boolean) => {
      const container = document.createElement('table');
      container.style.width = table.style.width || '100%';
      if (includeThead && thead) container.appendChild(thead.cloneNode(true));
      const tbodyClone = document.createElement('tbody');
      rows.forEach(row => tbodyClone.appendChild(row.cloneNode(true)));
      container.appendChild(tbodyClone);
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      document.body.removeChild(container);
      return canvas;
    };

    let i = 0;
    while (i < rows.length) {
      let batchRows = [];
      let batchHeight = 0;
      let batchCanvas = null;

      // Dynamically add rows until the batch image would overflow the page
      for (let j = i; j < rows.length; j++) {
        console.log('Adding row:', j, 'Current Y:', currentY, 'Batch Height:', batchHeight);
        batchRows.push(rows[j]);
        batchCanvas = await renderBatch(batchRows, currentY === 0 && thead != null);
        const imgHeight = (batchCanvas.height * pdfWidth) / batchCanvas.width;
        if (currentY + imgHeight > pdfHeight) {
          // If only one row doesn't fit, force it to next page
          if (batchRows.length === 1) break;
          batchRows.pop();
          break;
        }
        batchHeight = imgHeight;
      }

      // Render and add batch to PDF
      if (batchRows.length > 0) {
        console.log('Rendering batch:', i, 'Rows:', batchRows.length);
        batchCanvas = await renderBatch(batchRows, currentY === 0 && thead != null);
        const imgData = batchCanvas.toDataURL('image/png');
        const imgHeight = (batchCanvas.height * pdfWidth) / batchCanvas.width;
        if (currentY + imgHeight > pdfHeight && currentY !== 0) {
          pdf.addPage();
          currentY = 0;
        }
        pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
        currentY += imgHeight;
        i += batchRows.length;
      } else {
        // If no rows fit, start a new page
        pdf.addPage();
        currentY = 0;
      }
    }

    pdf.save('Transcript.pdf');
    this.isLoading = false;
  }



  generateWhatsappLinks(rowId: any): any {
    console.log('generateWhatsappLinks called with entry:', rowId, this.userArray[rowId]);
    let rowData = [this.userArray[rowId][12] + " " + this.userArray[rowId][13] + " " + this.userArray[rowId][14], this.userArray[rowId][4], ...this.userArray[rowId].slice(this.nonYearColumnCount)];
    // let rowData = [this.userArray[rowId][12] + " " + this.userArray[rowId][13] + " " + this.userArray[rowId][14], this.userArray[rowId][4], this.userArray[rowId][15],this.userArray[rowId][16],this.userArray[rowId][17],this.userArray[rowId][18]];
    console.log('Row Data:', rowData);
    // return;
    const yearLabels = [2022, 2023, 2024, 2025]; // add year here as next year coming like 2026, 2027, etc.
    const results = [];

    // for (const entry of data) {
      const username = rowData[0];
      const mobileRaw = rowData[1];
      const dues = rowData.slice(2, 2+yearLabels.length);
      const mobile = mobileRaw.trim();

      if (mobile.toLowerCase() === 'n/a') {
        results.push({ username, url: 'No Mobile number' });
        // continue;
      }

      const unpaidYears = dues
        .map((val: any, index: number) =>
          val === "0" ? yearLabels[index] : null
        )
        .filter((y: any) => y !== null);

      if (unpaidYears.length === 0) {
        results.push({ username, url: 'No pending fees' });
        // continue;
      }
      // alert user with reason
      if (results.length > 0) {
        alert(results[0].username + " : " +  results[0].url);
        return;
      }
      // Generate WhatsApp message
      if (unpaidYears.length > 0) {
        const yearsStr = unpaidYears.join(', ');
        const message = `જય રામજી કી, / નમસ્તે,
          શ્રીમાન ${username} આપની આણંદ માથુર વૈશ્ય શાખા સભાની વાર્ષિક સદસ્ય ફી (₹500 એક વર્ષની) વર્ષ- ${yearsStr} ની બાકી હોવાથી આપને ફી વહેલા તકે જમા કરાવવા વિનંતી .🙏
        લી.
        ખજાનચી 
        અજય આર. ગુપ્તા
        આણંદ માથુર વૈશ્ય શાખા સભા, આણંદ`;

        const encodedMessage = encodeURIComponent(message);
        const fullUrl = `https://wa.me/91${mobile}?text=${encodedMessage}`;
        // const shortUrl = await this.shortenUrl(fullUrl);

        // results.push({ username, url: fullUrl });
      // }
        console.log('fullURL:', message, fullUrl);
        window.open(fullUrl);
        return fullUrl;
      }
    

    
    

  }

  // public downloadTranscript2() {
  //   const table = document.getElementById('transcript_inner') as HTMLElement;
  //   const fileName = Math.random().toString(36).slice(2);
  //   const BATCH_SIZE = 30; // Process 30 rows at a time
  
  //   if (!table) {
  //     this.isLoading = false;
  //     return;
  //   }
  
  //   this.isLoading = true;
  //   const originalOverflow = table.style.overflow;
  //   const originalMaxHeight = table.style.maxHeight;
  //   table.style.overflow = 'visible';
  //   table.style.maxHeight = 'none';
  
  //   // Initialize jsPDF
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();
  //   let currentY = 0; // Tracks the current Y position on the page
  
  //   // Get table elements
  //   const thead = table.querySelector('thead') as HTMLElement;
  //   const tbody = table.querySelector('tbody') as HTMLElement;
  //   const rows = Array.from(tbody.querySelectorAll('tr')) as HTMLElement[];
  //   const noDataRow = tbody.querySelector('tr td[colspan]') as HTMLElement;
  
  //   // Function to render an element to canvas
  //   const renderToCanvas = async (element: HTMLElement) => {
  //     const canvas = await html2canvas(element, {
  //       scrollY: -window.scrollY,
  //       scale: 2,
  //       useCORS: true,
  //     });
  //     return canvas;
  //   };
  
  //   // Function to create a temporary container for a batch of rows
  //   const createBatchContainer = (rows: HTMLElement[], includeThead: boolean = false) => {
  //     const container = document.createElement('div');
  //     container.style.display = 'table';
  //     container.style.width = table.style.width || '100%';
  //     container.style.borderCollapse = 'collapse';
  
  //     // Clone thead if needed
  //     if (includeThead && thead) {
  //       const theadClone = thead.cloneNode(true) as HTMLElement;
  //       container.appendChild(theadClone);
  //     }
  
  //     // Clone rows for the batch
  //     rows.forEach((row) => {
  //       const rowClone = row.cloneNode(true) as HTMLElement;
  //       rowClone.style.display = 'table-row';
  //       container.appendChild(rowClone);
  //     });
  
  //     // Append to document temporarily (off-screen)
  //     container.style.position = 'absolute';
  //     container.style.left = '-9999px';
  //     document.body.appendChild(container);
  //     return container;
  //   };
  
  //   // Process elements in batches
  //   const processBatch = async (startIndex: number, includeThead: boolean = false) => {
  //     // Finalize PDF when done
  //     if (startIndex >= rows.length && !includeThead) {
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Handle "No data" case
  //     if (noDataRow && startIndex === 0) {
  //       const canvas = await renderToCanvas(noDataRow);
  //       const imgData = canvas.toDataURL('image/png');
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  //       if (currentY + imgHeight > pdfHeight) {
  //         pdf.addPage();
  //         currentY = 0;
  //       }
  
  //       pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
  //       currentY += imgHeight;
  
  //       // Finalize PDF
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Render thead independently if needed
  //     if (includeThead && thead && startIndex === 0) {
  //       const theadCanvas = await renderToCanvas(thead);
  //       const theadImgData = theadCanvas.toDataURL('image/png');
  //       const theadProps = pdf.getImageProperties(theadImgData);
  //       const theadHeight = (theadProps.height * pdfWidth) / theadProps.width;
  
  //       if (currentY + theadHeight > pdfHeight) {
  //         pdf.addPage();
  //         currentY = 0;
  //       }
  
  //       pdf.addImage(theadImgData, 'PNG', 0, currentY, pdfWidth, theadHeight);
  //       currentY += theadHeight;
  //     }
  
  //     // Calculate batch
  //     const batchRows = rows.slice(startIndex, startIndex + BATCH_SIZE);
  //     if (batchRows.length === 0) {
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Create and render batch
  //     const batchContainer = createBatchContainer(batchRows, includeThead && startIndex > 0);
  //     const canvas = await renderToCanvas(batchContainer);
  //     const imgData = canvas.toDataURL('image/png');
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  //     // Check if batch fits on the current page
  //     if (currentY + imgHeight > pdfHeight) {
  //       pdf.addPage();
  //       currentY = 0;
  //       document.body.removeChild(batchContainer); // Clean up
  //       await processBatch(startIndex, true); // Retry with thead on new page
  //       return;
  //     }
  
  //     pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
  //     currentY += imgHeight;
  
  //     // Clean up
  //     document.body.removeChild(batchContainer);
  
  //     // Process next batch
  //     processBatch(startIndex + BATCH_SIZE);
  //   };
  
  //   // Start processing
  //   setTimeout(() => {
  //     processBatch(0, true); // Start with thead
  //   }, 50);
  // }


  // public downloadTranscriptRoWbyRow() {
  //   const table = document.getElementById('transcript_inner') as HTMLElement;
  //   const fileName = Math.random().toString(36).slice(2);
  
  //   if (!table) {
  //     this.isLoading = false;
  //     return;
  //   }
  
  //   this.isLoading = true;
  //   const originalOverflow = table.style.overflow;
  //   const originalMaxHeight = table.style.maxHeight;
  //   table.style.overflow = 'visible';
  //   table.style.maxHeight = 'none';
  
  //   // Initialize jsPDF
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();
  //   let currentY = 0; // Tracks the current Y position on the page
  
  //   // Get table elements
  //   const thead = table.querySelector('thead') as HTMLElement;
  //   const tbody = table.querySelector('tbody') as HTMLElement;
  //   const rows = Array.from(tbody.querySelectorAll('tr')) as HTMLElement[];
  //   const noDataRow = tbody.querySelector('tr td[colspan]') as HTMLElement; // Check for "No data available"
  
  //   // Function to render an element to canvas
  //   const renderToCanvas = async (element: HTMLElement) => {
  //     const canvas = await html2canvas(element, {
  //       scrollY: -window.scrollY,
  //       scale: 2,
  //       useCORS: true,
  //     });
  //     return canvas;
  //   };
  
  //   // Process elements sequentially
  //   const processElement = async (index: number, includeThead: boolean = false) => {
  //     // Finalize PDF when done
  //     if (index >= rows.length && !includeThead) {
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Render thead on the first page or if specified
  //     if (includeThead && thead) {
  //       const theadCanvas = await renderToCanvas(thead);
  //       const theadImgData = theadCanvas.toDataURL('image/png');
  //       const theadProps = pdf.getImageProperties(theadImgData);
  //       const theadHeight = (theadProps.height * pdfWidth) / theadProps.width;
  
  //       if (currentY + theadHeight > pdfHeight) {
  //         pdf.addPage();
  //         currentY = 0;
  //       }
  
  //       pdf.addImage(theadImgData, 'PNG', 0, currentY, pdfWidth, theadHeight);
  //       currentY += theadHeight;
  //     }
  
  //     // If no data is available, handle the "No data" row
  //     if (noDataRow && index === 0) {
  //       const canvas = await renderToCanvas(noDataRow);
  //       const imgData = canvas.toDataURL('image/png');
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  //       if (currentY + imgHeight > pdfHeight) {
  //         pdf.addPage();
  //         currentY = 0;
  //       }
  
  //       pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
  //       currentY += imgHeight;
  
  //       // Finalize PDF
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Process each row
  //     if (index < rows.length) {
  //       console.log('Processing index:', index);
  //       const row = rows[index];
  //       console.log('Processing row:', row);
  //       const originalDisplay = row.style.display;
  //       row.style.display = 'table-row'; // Ensure row is visible
  //       row.style.display = originalDisplay; // Restore display

        
  
  //       const canvas = await renderToCanvas(row);
  //       const imgData = canvas.toDataURL('image/png');
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  //       // Check if row fits on the current page
  //       if (currentY + imgHeight > pdfHeight) {
  //         pdf.addPage();
  //         currentY = 0;
  //         // Optionally include thead on new pages
  //         await processElement(index, true);
  //         return;
  //       }
  
  //       pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
  //       currentY += imgHeight;
  
  //     }
  
  //     // Process next row
  //     processElement(index + 1);
  //   };
  
  //   // Start processing
  //   setTimeout(() => {
  //     processElement(0, true); // Start with thead
  //   }, 5);
  // }
  

  // public downloadTranscript() {
  //   const table = document.getElementById('transcript_inner') as HTMLElement;
  //   // const fileName = Math.random().toString(36).slice(2);
  //   const fileName = `${new Date().getDate().toString().padStart(2,'0')}-${(new Date().getMonth()+1).toString().padStart(2,'0')}-${new Date().getFullYear()}-${new Date().getHours().toString().padStart(2,'0')}-${new Date().getMinutes().toString().padStart(2,'0')}`;
  //   const BATCH_SIZE = 30; // Process 30 rows at a time
  
  //   if (!table) {
  //     this.isLoading = false;
  //     return;
  //   }
  
  //   this.isLoading = true;
  //   const originalOverflow = table.style.overflow;
  //   const originalMaxHeight = table.style.maxHeight;
  //   table.style.overflow = 'visible';
  //   table.style.maxHeight = 'none';
  
  //   // Initialize jsPDF
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();
  //   let currentY = 0; // Tracks the current Y position on the page
  
  //   // Get table elements
  //   const thead = table.querySelector('thead') as HTMLElement;
  //   const tbody = table.querySelector('tbody') as HTMLElement;
  //   const colgroup = table.querySelector('colgroup') as HTMLElement;
  //   const rows = Array.from(tbody.querySelectorAll('tr')) as HTMLElement[];
  //   const noDataRow = tbody.querySelector('tr td[colspan]') as HTMLElement;
  
  //   // Function to render an element to canvas
  //   const renderToCanvas = async (element: HTMLElement) => {
  //     const canvas = await html2canvas(element, {
  //       scrollY: -window.scrollY,
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //     });
  //     return canvas;
  //   };
  
  //   // Function to create a temporary container for a batch of rows
  //   const createBatchContainer = (rows: HTMLElement[], includeThead: boolean = false) => {
  //     const container = document.createElement('table');
  //     container.style.width = table.style.width || '100%';
  //     container.style.borderCollapse = table.style.borderCollapse || 'collapse';
  //     container.style.tableLayout = table.style.tableLayout || 'auto';
  //     container.style.fontSize = table.style.fontSize || 'inherit';
  //     container.style.lineHeight = table.style.lineHeight || 'inherit';
  //     container.className = table.className;
  
  //     // Copy colgroup and remove last column if exists
  //     if (colgroup) {
  //       const colgroupClone = colgroup.cloneNode(true) as HTMLElement;
  //       const cols = colgroupClone.querySelectorAll('col');
  //       if (cols.length > 0) {
  //         cols[cols.length - 1].remove(); // Remove last col
  //       }
  //       container.appendChild(colgroupClone);
  //     }
  
  //     // Clone thead and remove last column if needed
  //     if (includeThead && thead) {
  //       const theadClone = thead.cloneNode(true) as HTMLElement;
  //       const headerRow = theadClone.querySelector('tr');
  //       if (headerRow) {
  //         const cells = headerRow.querySelectorAll('th, td');
  //         if (cells.length > 0) {
  //           cells[cells.length - 1].remove(); // Remove last th/td
  //         }
  //       }
  //       container.appendChild(theadClone);
  //     }
  
  //     // Clone rows for the batch and remove last column
  //     const tbodyClone = document.createElement('tbody');
  //     rows.forEach((row) => {
  //       const rowClone = row.cloneNode(true) as HTMLElement;
  //       const cells = rowClone.querySelectorAll('td, th');
  //       if (cells.length > 0) {
  //         cells[cells.length - 1].remove(); // Remove last td/th
  //       }
  //       rowClone.style.display = 'table-row';
  //       tbodyClone.appendChild(rowClone);
  //     });
  //     container.appendChild(tbodyClone);
  
  //     // Append to document temporarily (off-screen)
  //     container.style.position = 'absolute';
  //     container.style.left = '-9999px';
  //     document.body.appendChild(container);
  //     return container;
  //   };
  
  //   // Process elements in batches
  //   const processBatch = async (startIndex: number, includeThead: boolean = false) => {
  //     // Finalize PDF when done
  //     if (startIndex >= rows.length && !includeThead) {
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Handle "No data" case
  //     if (noDataRow && startIndex === 0) {
  //       const noDataRowClone = noDataRow.cloneNode(true) as HTMLElement;
  //       // Adjust colspan if necessary
  //       const colspan = parseInt(noDataRow.getAttribute('colspan') || '1');
  //       if (colspan > 1) {
  //         noDataRowClone.setAttribute('colspan', (colspan - 1).toString());
  //       }
  //       const canvas = await renderToCanvas(noDataRowClone);
  //       const imgData = canvas.toDataURL('image/png');
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  //       if (currentY + imgHeight > pdfHeight) {
  //         pdf.addPage();
  //         currentY = 0;
  //       }
  
  //       pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
  //       currentY += imgHeight;
  
  //       // Finalize PDF
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Calculate batch
  //     const batchRows = rows.slice(startIndex, startIndex + BATCH_SIZE);
  //     if (batchRows.length === 0) {
  //       pdf.save(`${fileName}.pdf`);
  //       table.style.overflow = originalOverflow;
  //       table.style.maxHeight = originalMaxHeight;
  //       this.isLoading = false;
  //       return;
  //     }
  
  //     // Create and render batch
  //     const batchContainer = createBatchContainer(batchRows, includeThead || startIndex === 0);
  //     console.log('Batch container created:', batchRows, batchContainer);
  //     const canvas = await renderToCanvas(batchContainer);
  //     const imgData = canvas.toDataURL('image/png');
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  //     // Check if batch fits on the current page
  //     if (currentY + imgHeight > pdfHeight) {
  //       pdf.addPage();
  //       currentY = 0;
  //       document.body.removeChild(batchContainer); // Clean up
  //       await processBatch(startIndex, true); // Retry with thead on new page
  //       return;
  //     }
  
  //     pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
  //     currentY += imgHeight;
  
  //     // Clean up
  //     document.body.removeChild(batchContainer);
  
  //     // Process next batch
  //     processBatch(startIndex + BATCH_SIZE);
  //   };
  
  //   // Start processing
  //   setTimeout(() => {
  //     processBatch(0, true); // Start with thead
  //   }, 50);
  // }
  

}
