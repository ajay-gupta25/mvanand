import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import {FormGroup, Validators, FormControl } from '@angular/forms'
import { customEmailValidator } from '@helpers/validateemail';
import { User } from '../user.model';
import { UserService } from '@services/user.service';
import { takeUntil, Subject } from 'rxjs'
import { CompanyService } from '@services/company.service';
import { OrganizationService } from '@services/organization.service';
import { RoleService } from '@services/role.service';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from '@services/store.service';
import { GoogleSheetsService } from '@services/google-sheet/google-sheets.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent {
  isCreateButtonClicked = false;
  isEditButtonClicked = false;

  Userform = new FormGroup({
    // userName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    firstName: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    middleName: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    // code: new FormControl('+91'),
    mobile_no: new FormControl('', [Validators.maxLength(10),Validators.pattern(/^\d*$/)]),   
    address: new FormControl('', [Validators.maxLength(100)]),
    location: new FormControl('', [Validators.maxLength(30)]),
    email: new FormControl('', [customEmailValidator()]),
    marriageStatus: new FormControl(null),
    birthdate: new FormControl(),
    gautra: new FormControl('', [Validators.maxLength(30)]),
    kyc: new FormControl('No'),
    // emp_id: new FormControl(null, [Validators.maxLength(15)]),
    // company_id: new FormControl(null),
    // org_id: new FormControl(null),
    // role_id: new FormControl(null),
    // dep_id: new FormControl(null),
    // image: new FormControl(null),
  });
  IsCreatestatus:boolean=true;
  companies: any[] = [];
  userArray: User[] = [];
  organizations: any[] = [];
  departments: any[] = []
  public isLoading: boolean = true;
  editUser: User;
  companyName: any;
  emp_id: any = null;
  roles: any[] = [];
  id:any= null;
  imageUrl:any=null;
  marriageStatusArray = [{ "key": "Married" },
  { "key": "Unmarried" }, { "key": "Widow" }];
  countryCode: string = '';
  @ViewChild('userImage') userImage: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() onModalClose = new EventEmitter();
  @Input() userId: string | null = null;
  @Input() companyId: string | null = null;
  countries = [
    { name: 'Afghanistan', code: '+93' },
    { name: 'Albania', code: '+355' },
    { name: 'Algeria', code: '+213' },
    { name: 'American Samoa', code: '+1-684' },
    { name: 'Andorra', code: '+376' },
    { name: 'Angola', code: '+244' },
    { name: 'Anguilla', code: '+1-264' },
    { name: 'Antarctica', code: '+672' },
    { name: 'Antigua and Barbuda', code: '+1-268' },
    { name: 'Argentina', code: '+54' },
    { name: 'Armenia', code: '+374' },
    { name: 'Aruba', code: '+297' },
    { name: 'Australia', code: '+61' },
    { name: 'Austria', code: '+43' },
    { name: 'Azerbaijan', code: '+994' },
    { name: 'Bahamas', code: '+1-242' },
    { name: 'Bahrain', code: '+973' },
    { name: 'Bangladesh', code: '+880' },
    { name: 'Barbados', code: '+1-246' },
    { name: 'Belarus', code: '+375' },
    { name: 'Belgium', code: '+32' },
    { name: 'Belize', code: '+501' },
    { name: 'Benin', code: '+229' },
    { name: 'Bermuda', code: '+1-441' },
    { name: 'Bhutan', code: '+975' },
    { name: 'Bolivia', code: '+591' },
    { name: 'Bosnia and Herzegovina', code: '+387' },
    { name: 'Botswana', code: '+267' },
    { name: 'Brazil', code: '+55' },
    { name: 'British Indian Ocean Territory', code: '+246' },
    { name: 'Brunei', code: '+673' },
    { name: 'Bulgaria', code: '+359' },
    { name: 'Burkina Faso', code: '+226' },
    { name: 'Burundi', code: '+257' },
    { name: 'Cambodia', code: '+855' },
    { name: 'Cameroon', code: '+237' },
    { name: 'Canada', code: '+1' },
    { name: 'Cape Verde', code: '+238' },
    { name: 'Cayman Islands', code: '+1-345' },
    { name: 'Central African Republic', code: '+236' },
    { name: 'Chad', code: '+235' },
    { name: 'Chile', code: '+56' },
    { name: 'China', code: '+86' },
    { name: 'Christmas Island', code: '+61' },
    { name: 'Cocos Islands', code: '+61' },
    { name: 'Colombia', code: '+57' },
    { name: 'Comoros', code: '+269' },
    { name: 'Cook Islands', code: '+682' },
    { name: 'Costa Rica', code: '+506' },
    { name: 'Croatia', code: '+385' },
    { name: 'Cuba', code: '+53' },
    { name: 'Curacao', code: '+599' },
    { name: 'Cyprus', code: '+357' },
    { name: 'Czech Republic', code: '+420' },
    { name: 'Democratic Republic of the Congo', code: '+243' },
    { name: 'Denmark', code: '+45' },
    { name: 'Djibouti', code: '+253' },
    { name: 'Dominica', code: '+1-767' },
    { name: 'East Timor', code: '+670' },
    { name: 'Ecuador', code: '+593' },
    { name: 'Egypt', code: '+20' },
    { name: 'El Salvador', code: '+503' },
    { name: 'Equatorial Guinea', code: '+240' },
    { name: 'Eritrea', code: '+291' },
    { name: 'Estonia', code: '+372' },
    { name: 'Ethiopia', code: '+251' },
    { name: 'Falkland Islands', code: '+500' },
    { name: 'Faroe Islands', code: '+298' },
    { name: 'Fiji', code: '+679' },
    { name: 'Finland', code: '+358' },
    { name: 'France', code: '+33' },
    { name: 'French Polynesia', code: '+689' },
    { name: 'Gabon', code: '+241' },
    { name: 'Gambia', code: '+220' },
    { name: 'Georgia', code: '+995' },
    { name: 'Germany', code: '+49' },
    { name: 'Ghana', code: '+233' },
    { name: 'Gibraltar', code: '+350' },
    { name: 'Greece', code: '+30' },
    { name: 'Greenland', code: '+299' },
    { name: 'Grenada', code: '+1-473' },
    { name: 'Guam', code: '+1-671' },
    { name: 'Guatemala', code: '+502' },
    { name: 'Guinea', code: '+224' },
    { name: 'Guinea-Bissau', code: '+245' },
    { name: 'Guyana', code: '+592' },
    { name: 'Haiti', code: '+509' },
    { name: 'Honduras', code: '+504' },
    { name: 'Hong Kong', code: '+852' },
    { name: 'Hungary', code: '+36' },
    { name: 'Iceland', code: '+354' },
    { name: 'India', code: '+91' },
    { name: 'Indonesia', code: '+62' },
    { name: 'Iran', code: '+98' },
    { name: 'Iraq', code: '+964' },
    { name: 'Ireland', code: '+353' },
    { name: 'Israel', code: '+972' },
    { name: 'Italy', code: '+39' }
];
  imgUrl:string= null;
  selectedCountry: string = '+91';
  selectedCountryDialCode: string = '+91';
  defaultImageUrl = '../../../assets/img/user-default-img.png';

  public maxDate: string;

  yearColumnHeader;
  nonYearColumnCount = 12;
  user: any;

  constructor(private userService: UserService,
    private companyService: CompanyService,
    private organizationService: OrganizationService,
    private roleService: RoleService,
    private toastr: ToastrService,
    private sheetsService: GoogleSheetsService,
    private storeService: StoreService
  ) {
    // this.getRoles();
    // this.getDepartments();
  }
  
  
  ngOnInit(): void {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    if (this.userId) {
      this.Userform.get('status')?.setValidators([Validators.required]);
      // this.Userform.get('status')?.updateValueAndValidity();
      this.IsCreatestatus =false
    }
    this.countries.sort((a, b) => {
      return a.code.localeCompare(b.code);
    });
    if (this.userId) {
      this.getUserDetail(false);
    }
    // this.getCompanies();
    // this.Userform.get('company_id').valueChanges.subscribe(companyId => {
    //   this.Userform.get('org_id').setValue(null); 
    //   this.organizations = [];
    //   this.Userform.get('role_id').setValue(null);
    //   this.roles = [];
    //   if (companyId) {
    //     // this.getOrganizationsByCompany(companyId);
    //     // this.getRolesByCompany(companyId);
    //   }
    // });
    this.yearColumnHeader = this.sheetsService.userData[0].slice(this.nonYearColumnCount).filter(ud => {
      return ud;
    });
  }
  closeModal() {
    this.onModalClose.emit();
  }

  edituser(data, profilePhotoFlag: boolean) {
    this.Userform.get('firstName')?.setValue(data[1]);
    this.Userform.get('middleName')?.setValue(data[2]);
    this.Userform.get('lastName')?.setValue(data[3]);
    // this.Userform.get('code')?.setValue(data[4]);
    this.Userform.get('mobile_no')?.setValue(data[4]);
    this.Userform.get('address')?.setValue(data[5]);
    this.Userform.get('location')?.setValue(data[6]);
    this.Userform.get('email')?.setValue(data[7]);
    this.Userform.get('marriageStatus')?.setValue(data[8]);
    this.Userform.get('birthdate')?.setValue(data[9]);
    this.Userform.get('gautra')?.setValue(data[10]);
    this.Userform.get('kyc')?.setValue(data[11]);
    // this.Userform.get('location')?.setValue(data[4]);
    // this.Userform.get('company_id')?.setValue(data[4]);
    // this.Userform.get('org_id')?.setValue(data[4]);
    // this.Userform.get('role_id')?.setValue(data[4]);
    // this.Userform.get('dep_id')?.setValue(data[4]);
    this.imageUrl = data.image;
    // let emp = data.emp_id?data.emp_id:null;
    // this.id = data._id?data._id:null;
    // this.Userform.get('emp_id')?.setValue(data[0]);
     
    // this.emp_id = data.emp_id;
    // this.companyName = data.company_id;
    if (profilePhotoFlag) {
      this.storeService.setItem('profileimage', data.image, true);
    }

    

    // just for debugging only
    this.checkInvalidFields(this.Userform);
  };
  getUserDetail(profilePhotoFlag: boolean) {
    let destroy$ = new Subject<void>();
  
    // this.userService.getUserDetail(this.userId).pipe(
    //   takeUntil(destroy$)
    // ).subscribe({
    //   next: (responseData) => {
        this.user = this.sheetsService.userData[this.userId];
        this.edituser(this.user, profilePhotoFlag);
    //     destroy$.next();
    //   },
    //   error: (error) => {
    //     // Handle error if needed
    //   },
    //   complete: () => {
    //     destroy$.complete();
    //   }
    // });
  }

  checkInvalidFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control && control.invalid) {
        console.log(`Field '${key}' is invalid.`);
        console.log('Errors:', control.errors);
      }
    });
  }
  
  getCompanies(): void {
    let destroy$ = new Subject<void>();
  
    this.companyService.getCompanyList().pipe(
      takeUntil(destroy$)
    ).subscribe({
      next: (responseData: any) => {
        this.companies = responseData.data || [];
        destroy$.next();
      },
      error: (error) => {
        this.toastr.error(error.error.error);
      },
      complete: () => {
        destroy$.complete();
      }
    });
  }
  
  // getOrganizationsByCompany(Id: any) {
  //   let destroy$ = new Subject<void>();
  
  //   this.organizationService.getOrganizationByCompany(Id).pipe(
  //     takeUntil(destroy$)
  //   ).subscribe({
  //     next: (responseData: any) => {
  //       this.organizations = responseData.data;
  //       destroy$.next();
  //     },
  //     error: (error) => {
  //       // Handle error if needed
  //     },
  //     complete: () => {
  //       destroy$.complete();
  //     }
  //   });
  // }
  getRolesByCompany(companyId): void {
    let destroy$ = new Subject<void>();
  
    this.roleService.getRolesByCompany(companyId).pipe(
      takeUntil(destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res.success === 1) {
          this.roles = res.data || [];
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        // Handle error if needed
      },
      complete: () => {
        destroy$.complete();
      }
    });
  }
  
  getDepartments(): void {
    let destroy$ = new Subject<void>();
  
    this.userService.getdepartments().pipe(
      takeUntil(destroy$)
    ).subscribe({
      next: (responseData) => {
        this.departments = responseData.data;
        destroy$.next();
      },
      error: (error) => {
        this.toastr.error(error.error.error);
      },
      complete: () => {
        destroy$.complete();
      }
    });
  }
  
  addUpdate(userId: any) {
    let destroy$ = new Subject<void>();
    if (this.Userform.valid) {
      const formData = new FormData();
      const filteredData = Object.keys(this.Userform.value)
        .filter(key => this.Userform.value[key] !== undefined)
        .reduce((obj, key) => {
          obj[key] = this.Userform.value[key];
          return obj;
        }, {});
  
      Object.keys(filteredData).forEach(key => {
        formData.append(key, filteredData[key]);
      });
  
      if (userId) {
        this.isLoading =true;
        this.isEditButtonClicked = true;
        let userFormArray = Object.values(this.Userform.value);
        userFormArray.unshift(userId);
        
        this.user.slice(this.nonYearColumnCount).forEach((h,i) => {
          userFormArray.push(h);
          // this.Userform.addControl(h, new FormControl(0));
        });
        console.log('Object.entries(this.Userform.value): Update user: ',userFormArray);
        let rawAddress = parseInt(userId) + 1;
        this.updateSheetData('A'+rawAddress, userFormArray);
        // this.userService.updateUsers(this.userId, formData).pipe(
        //   takeUntil(destroy$)
        // ).subscribe({
        //   next: (responseData) => {
        //     const currentUserId = this.storeService.getItem('loggedUserId');
        //     this.toastr.success(responseData.message, 'Success');
        //     if (currentUserId == userId) {
        //       this.getUserDetail(true);
        //     }
        //     this.closeModal();
        //     destroy$.next();
        //     this.isEditButtonClicked = false;
        //   },
        //   error: (error) => {
        //     this.toastr.error(error.error.error || error.error?.message);
        //     this.isEditButtonClicked = false;
        //   },
        //   complete: () => {
        //     destroy$.complete();
        //     this.isEditButtonClicked = false;
        //   }
        // });
      } else {
        this.isLoading =true;
        console.log('user data new',formData, this.Userform);
        let userFormArray = Object.values(this.Userform.value);
        userFormArray.unshift(this.sheetsService.userData.length);
        this.yearColumnHeader.forEach(h => {
          userFormArray.push(0);
          // this.Userform.addControl(h, new FormControl(0));
        });
        console.log('12 sliced: ', this.sheetsService.userData[0].slice(12));
        console.log('yearColumnHeader:', this.yearColumnHeader);
        
        console.log('Object.entries(this.Userform.value)',userFormArray);
        this.addNewUser(userFormArray);
        // this.updateSheetData();
        // formData.delete('status');
        // this.isCreateButtonClicked = true;
        // this.userService.addUsers(formData).pipe(
        //   takeUntil(destroy$)
        // ).subscribe({
        //   next: (responseData) => {
        //     this.toastr.success(responseData.message, 'Success');
        //     this.closeModal();
        //     destroy$.next();
        //     this.isCreateButtonClicked = false;
        //   },
        //   error: (error) => {
        //     this.toastr.error(error.error.error || error.error?.message);
        //     this.isCreateButtonClicked = false;
        //   },
        //   complete: () => {
        //     destroy$.complete();
        //   }
        // });
      }
    } else {
      this.toastr.error('Please fill required* fields');
      this.isCreateButtonClicked = false;
      this.isEditButtonClicked = false;
    }
  }

  addNewUser(userdata) {
    this.sheetsService.appendSheetData('Sheet1', [userdata]).subscribe(
      (response) => {
        console.log('Data appended successfully:', response);
        this.toastr.success('User added successfully!', 'Success');
        this.closeModal();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error appending sheet data:', error);
        this.isLoading = false;
      }
    );
  }

  updateSheetData(rowAddress,userData) {
    this.sheetsService.updateSheetData('Sheet1', rowAddress, [userData]).subscribe(
      (response) => {
        console.log('Sheet updated successfully:', response);
        this.toastr.success('User Updated successfully!', 'Success');
        this.closeModal();
        this.isLoading = false;
      },
      (error) => console.error('Error updating sheet data:', error)
    );
  }
  
  openFileInput() {
    this.fileInput.nativeElement.click();
  }
  deleteImage() {
    const defaultImageUrl = '../../../assets/img/user-default-img.png';
    
    fetch(defaultImageUrl)
        .then(response => response.blob())
        .then(blob => {
            const file = new File([blob], 'user-default-img.png', { type: 'image/png' });
            const reader = new FileReader();
            reader.onload = () => {
                this.userImage.nativeElement.src = reader.result as string;
                // this.Userform.get('image').setValue(file);
            };
            reader.readAsDataURL(file);
        })
        .catch(error => {
            console.error('Error fetching the default image:', error);
        });
}
  onFileSelected(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        this.toastr.error('Only PNG and JPG files are allowed.' );
        fileInput.value = ''; 
        return;
      }
  
      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.toastr.error('The file size must be less than 5 MB.' );
        fileInput.value = '';
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = () => {
        this.userImage.nativeElement.src = reader.result as string;
        // this.Userform.get('image').setValue(file);  
      };
      reader.readAsDataURL(file);
  
      fileInput.value = '';
    }
  }
  
  
  onCountryChange() {
    const selectedCountryObj = this.countries.find(country => country.code === this.selectedCountry);
    if (selectedCountryObj) {
      this.selectedCountryDialCode = selectedCountryObj.code;
    } else {
      this.selectedCountryDialCode = '+91';
    }
  }

  checkDateValidation() {
    // const fDate = this.filterForm.get('fromDate').value;
    const tDate = this.Userform.get('birthdate').value;
    const today = new Date(); // Get today's date
  
    if (tDate) {
      // const fromDate = new Date(fDate);
      const birthdate = new Date(tDate);
  
      // Check if fromDate and toDate are valid dates
      // if (isNaN(fromDate.getTime())) {
      //   this.toastr.error("The 'From Date' is invalid.");
      //   this.filterForm.get('fromDate').reset();
      //   return;
      // }
  
      if (isNaN(birthdate.getTime())) {
        this.toastr.error("The Birthdate is invalid.");
        this.Userform.get('birthdate').reset();
        return;
      }
  
      // if (fromDate > toDate) {
      //   this.toastr.error("The 'To Date' cannot be before the 'From Date'.");
      //   this.filterForm.get('fromDate').reset();
      //   this.filterForm.get('toDate').reset();
      //   return;
      // }
  
      // if (fromDate > today) {
      //   this.toastr.error("The 'From Date' cannot be after today.");
      //   this.filterForm.get('fromDate').reset();
      //   return;
      // }
  
      if (birthdate > today) {
        this.toastr.error("The 'Birthdate' cannot be after today.");
        this.Userform.get('birthdate').reset();
        return;
      }
    }
  }

}

