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
import 'jspdf-autotable';
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
  search: string = '';
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

  enableSearch() {
    this.isSearchActivate = !this.isSearchActivate;
    this.resetSearch();
  }

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
    this.Objectfilter['search'] = this.search;
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

  filterUserBySearch() {
    const query = this.search.toLowerCase();
    this.activeSearch = 'combine';

    // Reset the table if the search value is empty
    if (!query) {
      this.resetSearch();
      return;
    }

    this.userArray = this.sheetsService.userData.slice(1).filter(user => 
      user[1].toLowerCase().includes(query) ||
      user[2].toLowerCase().includes(query) ||
      user[3].toLowerCase().includes(query) ||
      user[4].toLowerCase().includes(query) ||
      user[5].toLowerCase().includes(query) ||
      user[7].toLowerCase().includes(query)
    );
  }

  onSearch(column: string, event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Cast to HTMLInputElement
    // Disable other search boxes and wipe their values
    this.userHeader.forEach(header => {
      if (header !== column) {
        this.searchValues[header] = '';
      }
    });
  
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
      let memberData = '';
      if (this.selectedLanguage == 'English') memberData = `${row[1]} ${row[2]} ${row[3]}`;
      else memberData = `${row[12]} ${row[13]} ${row[14]}`;
      return [
        {text: (index + 1).toString(), style: 'tableData'}, // #
        {text: memberData, style: 'tableData'}, // Member Name
        {text: row[this.nonYearColumnCount + 0] || 'N/A', style: 'tableData'}, // 2022
        {text: row[this.nonYearColumnCount + 1] || 'N/A', style: 'tableData'}, // 2023
        {text: row[this.nonYearColumnCount + 2] || 'N/A', style: 'tableData'}, // 2024
        {text: row[this.nonYearColumnCount + 3] || 'N/A', style: 'tableData'}, // 2025
        {text: row[this.nonYearColumnCount + 4] || 'N/A', style: 'tableData'}, // 2026
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
  
    // Generate and download the PDF
    pdfMake.createPdf(docDefinition).download('MvAnand.pdf');
  }
  
  

}
