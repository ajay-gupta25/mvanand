// Angular modules
import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector    : 'app-form-confirm',
  templateUrl : './form-confirm.component.html',
  styleUrls   : ['./form-confirm.component.scss']
})
export class FormConfirmComponent
{
  @Input()  data        : any;
  @Output() submitData  : EventEmitter<boolean> = new EventEmitter();
  @Output() submitClose : EventEmitter<null>    = new EventEmitter();
  // -------------------------------------------------------------------------------
  // NOTE Action -------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickSubmit() : Promise<void>
  {
    this.submitData.emit(true);
  }

  public onClickClose() : void
  {
    this.submitClose.emit();
  }

}
