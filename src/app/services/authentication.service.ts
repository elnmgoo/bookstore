import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUserValue: string;

  constructor() {
  }

  login(username, password) {
    return (true);
  }
}
