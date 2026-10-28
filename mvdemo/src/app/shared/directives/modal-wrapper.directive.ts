// Angular modules
import { Directive, ViewContainerRef}        from '@angular/core';

@Directive({
    selector: '[modal-wrapper-host]',
    standalone: false
})
export class ModalWrapperDirective
{
  constructor(public viewContainerRef : ViewContainerRef) { }
}
