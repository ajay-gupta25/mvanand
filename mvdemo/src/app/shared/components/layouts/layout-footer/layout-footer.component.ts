import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.scss']
})
export class LayoutFooterComponent {

  public appVersion : string  = environment.version;

}
