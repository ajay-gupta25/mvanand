import { Options } from '@angular-slider/ngx-slider';
import { Component, ElementRef, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { CompanyService } from '@services/company.service';
import { Router } from '@angular/router';
import { FolderService } from '@services/folder.service';
import { ToastrService } from 'ngx-toastr';
import { OrganizationService } from '@services/organization.service';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js/auto';

interface FolderList {
  _id:      string;
  name:     string;
}

import { Callfiles, FilterDetails, FilterList } from './dashboard.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';

interface OrgList {
  _id:      string;
  org_name: string;
}

interface FolderList {
  _id:      string;
  name:     string;
}
interface CompanyList {
  _id:      string;
  company_name:     string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild('myChartCallVolume') myChartCallVolume!: ElementRef;
  @ViewChild('myChartCallDuration') myChartCallDuration!: ElementRef;
  @ViewChild('myBarChartForAgent') myBarChartForAgent!: ElementRef;
  @ViewChild('myBarChartForClient') myBarChartForClient!: ElementRef;


  @ViewChild('info_model', { static: true }) public infoModel: TemplateRef<any>;
  private modelRef: NgbModalRef;
  TabActive = 1;
  morefilterFlag: boolean = false;
  isLoading = false;
  value: number = 1;
  highValue: number = 3;
  options: Options = {
    floor: 0,
    ceil: 6,
  };
  public callFileList: Callfiles[] = [];
  private subscriptionList: Subscription[] = [];
  public orgList: OrgList[] = [];
  public companyList: CompanyList[] = [];
  public folderList: FolderList[] = [];
  public filterList: Array<FilterList> = [];
  public selectedOrgId: string = null;
  public selectedFolderId: string = null;
  public selectedDate: string = null;
  public selectedCompanyId: string = null;
  public date: string = null;
  public fromDateCallReport: string = null;
  public toDateCallReport: string = null;
  public search: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalCount:number = 0;
  public columnControl = {
    agentID: false,
    time: false,
    duration: false,
    silenceTime: false,
    overtalk: false,
    diarization: false,
    agentClarity: false,
    clientClarity: false,
    agentGender: false,
    clientGender: false,
    transcriptID: false,
    requestID: false,
    // Add more controls as needed
  };

  selectCom:any = null;
  selectOrg:any = null;
  selectfold:any = null;
  fromDate:any = null;
  toDate:any = null;
  callCounts:any;
  transcriptData: any[]; 

  //chart
  labels: string[] = [];
public filterForm: FormGroup;

filterDetails: FilterDetails;

genderOption = [{
  label: 'Agent',
  value: 'Agent'
},
{
  label: 'Client',
  value: 'Client'
}];

termOption = [{
  label: 'Speaker',
  value: 'Speaker'
},
{
  label: 'Agent',
  value: 'Agent'
},
{
  label: 'Client',
  value: 'Client'
},
{
  label: 'Tag',
  value: 'Tag'
},
{
  label: 'Request Id',
  value: 'Request Id'
}];

emotionOption = [
{
  label: 'Overall',
  value: 'Overall'
},
{
  label: 'Agent',
  value: 'Agent'
},
{
  label: 'Client',
  value: 'Client'
}];

emotionValue = [
  {
    label: 'All',
    value: 'All'
  },
  {
    label: 'Positive',
    value: 'Positive'
  },
  {
    label: 'Negative',
    value: 'Negative'
  },
  {
    label: 'Worsening',
    value: 'Worsening'
  }]

  public overTalk_highValue: number = 3;
  public overTalk_options: Options = {
    floor: 0,
    ceil: 50,
    step: 0.1
  }

  public callDuration_highValue: number = 3;
  public callDuration_options: Options = {
    floor: 0,
    ceil: 50,
    step: 0.1
  }
  public callSilence_highValue: number = 3;
  public callSilence_options: Options = {
    floor: 0,
    ceil: 50,
    step: 0.1
  }

  public agent_clearity_highValue: number = 3;
  public agent_clearity_options: Options = {
    floor: 0,
    ceil: 50,
    step: 0.1
  }

  public client_clearity_highValue: number = 3;
  public client_clearity_options: Options = {
    floor: 0,
    ceil: 50,
    step: 0.1
  }

  public diarization_highValue: number = 3;
  public diarization_options: Options = {
    floor: 0,
    ceil: 50,
    step: 0.1
  }
  public customMetadata: Array<string> = [];
  public maxDate: string;
  rolename: any;

  constructor(private organizationService: OrganizationService, private companyService: CompanyService,
    private folderService: FolderService, private router: Router,  private toastr: ToastrService,
    private modalService: NgbModal,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { 
    this.filterForm = this.formBuilder.group({
      gender_type: new FormControl('Agent', [Validators.required]),
      gender: new FormControl('Male', [Validators.required]),
      term: new FormControl('Speaker', [Validators.required]),
      termVal: new FormControl('', [Validators.required]),
      emotion: new FormControl('All', [Validators.required]),
      emotion_type: new FormControl('Overall', [Validators.required]),
      Duration: new FormControl(0, [Validators.required]),
      Over_Talk: new FormControl(0, [Validators.required]),
      Silence_Time: new FormControl(0, [Validators.required]),
      Agent_Clarity: new FormControl(0, [Validators.required]),
      Client_Clarity: new FormControl(0, [Validators.required]),
      Diarization: new FormControl(0, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      filterId: new FormControl(null)
      });
   }
 

  public ngOnInit(): void {
    setTimeout(_ => {
    }, 0);
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    // this.getUserProfile();
    // this.getCompanyList();
    let permission: any = localStorage.getItem('permissions');
    if (permission) {
      permission = JSON.parse(permission);
      this.rolename = permission.name;
    }
  }

  ngAfterViewInit() {
    // code block for after view initialize
  }
  private chartForCallVolume: any;
  private chartForCallDuration: any;
  private barChartForAgent: any;
  private barChartForClient: any;

  ngOnDestroy() {
    if (this.chartForCallVolume) {
      this.chartForCallVolume.destroy();
    }
    else if (this.chartForCallDuration) {
      this.chartForCallDuration.destroy();
    }
    else if (this.barChartForAgent) {
      this.barChartForAgent.destroy();
    }
    else if (this.barChartForClient) {
      this.barChartForClient.destroy();
    }
    this.subscriptionList.forEach(sub => sub.unsubscribe());
    this.closeMorefilter();
  }

  reloadPage() {
    window.location.reload();
  }
  public openMorefilter(): void {
    this.morefilterFlag = true;
    $('.site_container').addClass('show_Morefilter');
  }

  public closeMorefilter(): void {
    this.morefilterFlag = false;
    this.clearMoreFilter();
    $('.site_container').removeClass('show_Morefilter');
  }

  checkDateValidation() {
    const fDate = this.fromDate;
    const tDate = this.toDate;
    const today = new Date(); // Get today's date
  
    if (fDate && tDate) {
      const fromDate = new Date(fDate);
      const toDate = new Date(tDate);
  
      // Check if fromDate and toDate are valid dates
      if (isNaN(fromDate.getTime())) {
        this.toastr.error("The 'From Date' is invalid.");
        this.fromDate = null;
        return;
      }
  
      if (isNaN(toDate.getTime())) {
        this.toastr.error("The 'To Date' is invalid.");
        this.toDate = null;
        return;
      }
  
      if (fromDate > toDate) {
        this.toastr.error("The 'To Date' cannot be before the 'From Date'.");
        this.fromDate = null;
        this.toDate = null;
        return;
      }
  
      if (fromDate > today) {
        this.toastr.error("The 'From Date' cannot be after today.");
        this.fromDate = null;
        return;
      }
  
      if (toDate > today) {
        this.toastr.error("The 'To Date' cannot be after today.");
        this.toDate = null;
        return;
      }
    }
  }

  getUserProfile() {
    let userId = localStorage.getItem('loggedUserId');
    this.userService.getUserDetail(userId).subscribe({
      next: (res: any) => {
        this.selectCom = res.data.company_id;
        this.getCallsCount(this.selectCom);
        // this.getOrganizationsList();
      },
      error: (error: any) => {
        this.toastr.error(error.error?.error || 'Error fetching user profile', 'Error');
        console.error('Error fetching user profile', error);
      }
    });

  }

  getCallsCount(companyId?): void {
    if (this.rolename !== 'SUP45367') {
      if (!companyId && !this.selectCom) {
        this.toastr.error('Company selection required!');
        return;
      }
    }
    this.isLoading = true;
    let params: any = {};
    
    if (companyId || this.selectCom) params.companyId = companyId || this.selectCom;
    if (this.selectOrg) params.org_id = this.selectOrg;
    if (this.selectfold) params.folderId = this.selectfold;
    if (this.fromDate) params.fromDate = this.fromDate;
    if (this.toDate) params.toDate = this.toDate;
    this.folderService.getCallsCount(params).subscribe({
      next: (res: any) => {
        if (res.success === 1) {
          this.callCounts = res.data || [];
          console.log('graph data: ', this.callCounts);
          this.createChartDataForCallVolumeVsDays();
          this.createChartDataForCallDurationVsDays();
          this.createBarChartDataForClientEmotionAnalysis();
          this.createBarChartDataForAgentEmotionAnalysis();
          setTimeout(_ => {
            this.isLoading = false;
          }, 1000);
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (error: any) => {
        this.toastr.error(error.error?.error || 'Error fetching call count', 'Error');
        console.error('Error fetching call count', error);
      }
    });
  }
  

  validateObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null)
  );
  }

  public getEmotionClass(emotion: string): string {
    switch (emotion) {
      case 'Improving':
        return 'warning'; // Bootstrap class for yellow
      case 'Satisfied':
        return 'success'; // Bootstrap class for green
      case 'Negative':
        return 'danger'; // Bootstrap class for red
      default:
        return '';
    }
  }

  // getOrganizationsList(): void {
  //   this.orgList = [];
  //   this.selectOrg = null;
  //   if (!this.selectCom) return;
  //   this.subscriptionList.push(
  //     this.organizationService.getOrganizationByCompany(this.selectCom).subscribe({
  //       next: (res: any) => {
  //         if (res.success === 1) {
  //           this.orgList = res.data || [];
  //         } else {
  //           this.toastr.error(res.error?.message || 'Error fetching organizations list', 'Error');
  //         }
  //       },
  //       error: (error: any) => {
  //         this.toastr.error(error.error?.error || 'Error fetching organizations list', 'Error');
  //         console.error('Error fetching organizations list', error);
  //       }
  //     })
  //   );
  // }

  clearGraphFilters() {
    this.selectCom = null;
    this.selectOrg = null;
    this.selectfold = null;
    this.fromDate = null;
    this.toDate = null;
  }


//chart - call volume vs days
createChartDataForCallVolumeVsDays() {
  let cvData = []
  let labels = []
  this.callCounts.callVolumeGraph.map((cv) => {
    labels.push(cv.value);
    cvData.push(cv?.callVolume);
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Call Volume',
        data: cvData,
        backgroundColor: 'rgba(0, 99, 132, 0.2)',
        borderColor: 'rgba(0, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  this.createChartForCallVolumeVsDays(data);
}
createChartForCallVolumeVsDays(data: any) {
  const canvas = document.getElementById('myChartCallVolume') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (ctx) {
      if (this.chartForCallVolume) {
        this.chartForCallVolume.destroy();
      }
      this.chartForCallVolume = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Call Volume'
            }
          }
        }
      }
    });
  }
}

//call duration vs days
createChartDataForCallDurationVsDays() {
  let callDuration = []
  let timeKeys = [];
  let labels = []
  this.callCounts.callDurationGraph.map((cv) => {
    labels.push(cv.value);
    callDuration.push(parseInt(cv?.callDuration));
    timeKeys.push(cv.timekey);
  });
  const lableText = Array.isArray(this.callCounts.callDurationGraph) && this.callCounts.callDurationGraph.lenght && this.callCounts.callDurationGraph[0].datekey;

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Call Duration',
        data: callDuration,
        backgroundColor: 'rgba(0, 99, 132, 0.2)',
        borderColor: 'rgba(0, 99, 132, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'blue',
        pointBorderColor: 'blue',
        pointRadius: 4
      }
    ]
  };
  this.createChartForCallDurationVsDays(data, lableText, timeKeys);
}
createChartForCallDurationVsDays(data: any, lableText: string, timeKeys: string[]) {
  const canvas = document.getElementById('myChartCallDuration') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (this.chartForCallDuration) {
      this.chartForCallDuration.destroy();
    }

    this.chartForCallDuration = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Call Duration'
            }
          },
          x: {
            title: {
              display: true,
              text: lableText
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                const timeKey = timeKeys[context.dataIndex]; // Access the corresponding timeKey

                return `${label}: ${value} ${timeKey}`;
              }
            }
          }
        }
      }
    });
  }
}

//AgentEmotion
createBarChartDataForAgentEmotionAnalysis() {
  let negData = [];
  let posData = [];
  let labels = [];
  this.callCounts?.agentEmotionGraph.map((cv) => {
    labels.push(cv.value);
    posData.push(cv?.positive);
    negData.push(cv?.negative);
  });
  const lableText = Array.isArray(this.callCounts.agentEmotionGraph) && this.callCounts.agentEmotionGraph.lenght && this.callCounts.agentEmotionGraph[0].datekey;
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Positive + Improving',
        data: posData,
        backgroundColor: '#1AB539',
        borderColor: '#1AB539',
        borderWidth: 1
      },
      {
        label: 'Negative + Worsening',
        data: negData,
        backgroundColor: '#E64445',
        borderColor: '#E64445',
        borderWidth: 1
      }
    ]
  };
  this.createBarChartForAgentEmotionAnalysis(data, lableText);
}
createBarChartForAgentEmotionAnalysis(data: any, lableText: string) {
  const canvas = document.getElementById('myBarChartForAgent') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (this.barChartForAgent) {
      this.barChartForAgent.destroy();
    }

    this.barChartForAgent = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: -100,
            max: 100,
            title: {
              display: true,
              text: 'Positive/Negative'
            }
          },
          x: {
            title: {
              display: true,
              text: lableText
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y + '%';
                return label;
              }
            }
          }
        }
      }
    });
  }
}

//client emotion
createBarChartDataForClientEmotionAnalysis() {
  let negData = [];
  let posData = [];
  let labels = [];
  this.callCounts?.clientEmotionGraph.map((cv) => {
    labels.push(cv.value);
    posData.push(cv?.positive);
    negData.push(cv?.negative);
  });
  const lableText = Array.isArray(this.callCounts.clientEmotionGraph) && this.callCounts.clientEmotionGraph.lenght && this.callCounts.clientEmotionGraph[0].datekey;
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Positive + Improving',
        data: posData,
        backgroundColor: '#1AB539',
        borderColor: '#1AB539',
        borderWidth: 1
      },
      {
        label: 'Negative + Worsening',
        data: negData,
        backgroundColor: '#E64445',
        borderColor: '#E64445',
        borderWidth: 1
      }
    ]
  };
  this.createBarChartForClientEmotionAnalysis(data, lableText);
}
createBarChartForClientEmotionAnalysis(data: any, lableText: string) {
  const canvas = document.getElementById('myBarChartForClient') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (this.barChartForClient) {
      this.barChartForClient.destroy();
    }

    this.barChartForClient = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: -100,
            max: 100,
            title: {
              display: true,
              text: 'Positive/Negative'
            }
          },
          x: {
            title: {
              display: true,
              text: lableText
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y + '%';
                return label;
              }
            }
          }
        }
      }
    });
  }
}


    
private getFilterList(): void {
  this.subscriptionList.push(
    this.folderService.getFilterListApiCall().subscribe({
      next: (res: any) => {
        if (res.success === 1) {
          this.filterList = res.data || []; // Use empty array as a fallback
        } else {
          this.toastr.error(res.message || 'Error fetching filter list', 'Error');
        }
      },
      error: (error: any) => {
        this.toastr.error(error.error?.error || 'Error fetching filter list', 'Error');
        console.error('Error fetching filter list', error);
      }
    })
  );
}


  private handleError(error) {
    this.isLoading = false;
    this.toastr.error(error.error.error );
  }

  public selectDeselectAll(event: Event) {
    const input = event.target as HTMLInputElement;  // Type assertion here
    const isChecked = input.checked;
    for (const key in this.columnControl) {
      this.columnControl[key] = isChecked;
    }
  }

  public applyFilters() {
      this.currentPage = 1;
      this.itemsPerPage = 10;
      this.filterCalllistWithElasticSearch();
  }

  public openInfoModel() {
    this.closeModel();
    this.modelRef = this.modalService.open(this.infoModel, {backdrop: 'static', keyboard: false})
  }

  private closeModel() {
    if (this.modelRef) {
      this. modelRef.close();
    }
  }

  public clearFilters() {
    this.search = ''; // Clear the search input
    this.selectedOrgId = null;
    this.selectedFolderId = null;
    this.fromDateCallReport = '';
    this.toDateCallReport = '';
    this.selectedCompanyId = null;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.filterCalllistWithElasticSearch();
  }
  
  public getFilterDetails(event: any): void {
    if (!event) {
      this.clearMoreFilter();
      return;
    }
  
    this.customMetadata.forEach(ele => {
      this.filterForm.removeControl(ele);
    });
    this.customMetadata = [];
  
    this.subscriptionList.push(
      this.folderService.getFilterApiCall(this.filterForm.get('filterId')?.value).subscribe({
        next: (res: any) => {
          if (res.success === 1) {
            const formControls = this.filterForm.controls;
            const data = res.data;
  
            formControls['gender_type'].setValue(data?.gender_type);
            formControls['gender'].setValue(data?.gender);
            formControls['term'].setValue(data?.term);
            formControls['termVal'].setValue(data?.termVal);
            formControls['emotion'].setValue(data?.emotion);
            formControls['emotion_type'].setValue(data?.emotion_type);
            formControls['Duration'].setValue(data?.Duration);
            formControls['Over_Talk'].setValue(data?.Over_Talk);
            formControls['Silence_Time'].setValue(data?.Silence_Time);
            formControls['Agent_Clarity'].setValue(data?.Agent_Clarity);
            formControls['Client_Clarity'].setValue(data?.Client_Clarity);
            formControls['Diarization'].setValue(data?.Diarization);
            formControls['name'].setValue(data?.name);
  
            if (data?.customeMetadata?.length) {
              data.customeMetadata.forEach(metadata => {
                const key = Object.keys(metadata)[0];
                const value = metadata[key];
                this.customMetadata.push(key);
                this.filterForm.addControl(key, this.formBuilder.control(value));
                this.cdr.detectChanges();
              });
            }            
          } else {
            this.toastr.error(res.message, 'Error');
          }
        },
        error: (error: any) => {
          this.handleError(error);
        }
      })
    );
  }

  public clearFilter() {
    this.filterForm.reset();
    this.filterForm.get('gender_type').setValue('Agent');
    this.filterForm.get('gender').setValue('Male');
    this.filterForm.get('term').setValue('Speaker');
    this.filterForm.get('termVal').setValue('');
    this.filterForm.get('emotion').setValue('All');
    this.filterForm.get('emotion_type').setValue('Overall');
    this.filterForm.get('Duration').setValue(0);
    this.filterForm.get('Over_Talk').setValue(0);
    this.filterForm.get('Silence_Time').setValue(0);
    this.filterForm.get('Agent_Clarity').setValue(0);
    this.filterForm.get('Client_Clarity').setValue(0);
    this.filterForm.get('Diarization').setValue(0);
    this.filterForm.get('name').setValue('');
  }

  applyMoreFilter() {
    let params: any = {
    gender_type: this.filterForm.get('gender_type').value,
    gender: this.filterForm.get('gender').value,
    term: this.filterForm.get('term').value,
    termVal: this.filterForm.get('termVal').value,
    emotion: this.filterForm.get('emotion').value,
    emotion_type: this.filterForm.get('emotion_type').value,
    Duration: this.filterForm.get('Duration').value,
    Over_Talk: this.filterForm.get('Over_Talk').value,
    Silence_Time: this.filterForm.get('Silence_Time').value,
    Agent_Clarity: this.filterForm.get('Agent_Clarity').value,
    Client_Clarity: this.filterForm.get('Client_Clarity').value,
    Diarization: this.filterForm.get('Diarization').value,
   }
   if (this.customMetadata.length) {
    params['customeMetadata'] = [];
    this.customMetadata.forEach(ele => {
      params['customeMetadata'].push({[ele]: this.filterForm.get(ele).value})
    })
    params['customeMetadata'] = JSON.stringify(params['customeMetadata']);
  }
  this.filterCalllistWithElasticSearch(params);
   }
  
  private getCompanyList(): void {
    this.subscriptionList.push(
      this.companyService.getCompanyList().subscribe({
        next: (res: any) => {
          if (res.success === 1) {
            this.companyList = res.data || [];
          } else {
            this.toastr.error(res.error?.message || 'Error fetching company list', 'Error');
          }
        },
        error: (error: any) => {
          this.handleError(error);
        }
      })
    );
  }
  


  public onTableDataChange(event: any): void {
    this.currentPage = event;
    this.filterCalllistWithElasticSearch();
  }

  public onTableSizeChange(event: any): void {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.filterCalllistWithElasticSearch();
  }

  public calculateIndex(indexOnPage: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + indexOnPage + 1;
  }

  public filterCalllistWithElasticSearch(filterParams?: any): void {
    let params: any = {
      folderId: this.selectedFolderId,
      org_id: this.selectedOrgId,
      fromDate: this.fromDateCallReport,
      toDate: this.toDateCallReport,
      search: this.search,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
  
    if (filterParams && Object.keys(filterParams).length) {
      params = { ...params, ...filterParams };
    }
  
    params = this.validateObject(params);
  
    this.subscriptionList.push(
      this.folderService.getCallFilesWithElasticSearch(params).subscribe({
        next: (res: any) => {
          if (res.success === 1) {
            this.callFileList = res.data?.callfiles || [];
            this.totalCount = res.data?.totalCount || 0; // Default to 0 if undefined
          } else {
            this.toastr.error(res.message || 'Error fetching call files', 'Error');
          }
        },
        error: (error: any) => {
          this.handleError(error);
        }
      })
    );
  }
  

  public clearMoreFilter() {
    this.filterForm.reset();
    this.filterForm.get('gender_type').setValue('Agent');
    this.filterForm.get('gender').setValue('Male');
    this.filterForm.get('term').setValue('Speaker');
    this.filterForm.get('termVal').setValue('');
    this.filterForm.get('emotion').setValue('All');
    this.filterForm.get('emotion_type').setValue('Overall');
    this.filterForm.get('Duration').setValue(0);
    this.filterForm.get('Over_Talk').setValue(0);
    this.filterForm.get('Silence_Time').setValue(0);
    this.filterForm.get('Agent_Clarity').setValue(0);
    this.filterForm.get('Client_Clarity').setValue(0);
    this.filterForm.get('Diarization').setValue(0);
    this.filterForm.get('name').setValue('');
    this.filterForm.get('filterId').setValue(null);
  }

  public getFolderByorganisationID(value:any): void{
    this.subscriptionList.push(
      this.folderService.getFolderByorganisationID(value._id).subscribe({
        next: (res: any) => {
          if (res.success === 1) {
            this.folderList = res.data || [];
          } else {
            this.toastr.error(res.error.message);
          }
        },
        error: (error) => {
          this.handleError(error);
        },
      })
    );
  }
}
