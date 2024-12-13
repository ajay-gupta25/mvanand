// Angular modules
import { Directive, ViewContainerRef}        from '@angular/core';

@Directive({
  selector : '[modal-wrapper-host]',
})
export class ModalWrapperDirective
{
  constructor(public viewContainerRef : ViewContainerRef) { }
}
