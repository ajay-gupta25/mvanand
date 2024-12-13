import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { takeUntil, Subject } from 'rxjs'
import { UserService } from '@services/user.service';
import { User } from '../user.model'

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent {
  modelRef: NgbModalRef;
  userdetails: User;
  edituserId: string;
  companyId:string;
  imageUrl:string=null;
  public isLoading: boolean = true;
  @Output() onModalClose = new EventEmitter();
  @Input() userId: string | null = null;
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
  ) { }
  ngOnInit(): void {
    setTimeout(_ => {
      this.isLoading = false;
    }, 2000);
    this.getUserDetail()
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modelRef = this.modalService.open(content, { centered: true })
  };
  closeModal() {
    this.onModalClose.emit()
  }

  edituser(userdata:any, template: TemplateRef<any>) {
    this.edituserId = userdata._id;
    this.companyId =userdata.company_id;
    this.openVerticallyCentered(template)
  }
  getUserDetail() {
    let destroy$ = new Subject<void>();
  
    this.userService.getUserDetail(this.userId).pipe(
      takeUntil(destroy$)
    ).subscribe({
      next: (responseData) => {
        this.userdetails = responseData.data;
        this.imageUrl = this.userdetails?.image;
        destroy$.next();
      },
      error: (error) => {
        // Handle the error
      },
      complete: () => {
        destroy$.complete();
      }
    });
  }
  
  
}
