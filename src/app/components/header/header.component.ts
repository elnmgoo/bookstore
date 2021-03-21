import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  buildTimestamp = environment.buildTimestamp;
  browser: string;
  constructor() { }

  ngOnInit(): void {
    this.browser = this.myBrowser();
  }

  myBrowser() {
    const userAgent = navigator.userAgent;
    if ((userAgent.indexOf('Opera') || userAgent.indexOf('OPR')) !== -1 ) {
      return 'Opera';
    }else if (userAgent.indexOf('Chrome') !== -1 ){
      return 'Chrome';
    }else if (userAgent.indexOf('Safari') !== -1){
      return 'Safari';
    }else if (userAgent.indexOf('Firefox') !== -1 ) {
      return 'Firefox';
    }else if ((userAgent.indexOf('MSIE') !== -1 )){
      return 'IE (Not supported)';
    } else {
      return 'unknown';
    }
  }
}
