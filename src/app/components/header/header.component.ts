import {Component, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private serverUrl = environment.apiUrl + '/server';
  constructor(private http: HttpClient, public router: Router) {
  }

  buildTimestamp = environment.buildTimestamp;
  browser: string;
  origin: string;

  ngOnInit(): void {
    this.browser = this.myBrowser();
    this.origin = window.location.origin;

    if ('127.0.0.1' === window.location.hostname) {
      this.origin = window.location.protocol + this.getIPAddress();
    }

  }

  getIPAddress() {
    this.http.get(this.serverUrl + '/ipaddress', {responseType: 'text'} ).subscribe((res: any) => {
      this.origin =  window.location.protocol + '//' + res + ':' + window.location.port ;
    });
  }

  myBrowser() {
    const userAgent = navigator.userAgent;
    if ((userAgent.indexOf('Opera') || userAgent.indexOf('OPR')) !== -1) {
      return 'Opera';
    } else if (userAgent.indexOf('Chrome') !== -1) {
      return 'Chrome';
    } else if (userAgent.indexOf('Safari') !== -1) {
      return 'Safari';
    } else if (userAgent.indexOf('Firefox') !== -1) {
      return 'Firefox';
    } else if ((userAgent.indexOf('MSIE') !== -1)) {
      return 'IE (Not supported)';
    } else {
      return 'unknown';
    }
  }
}
