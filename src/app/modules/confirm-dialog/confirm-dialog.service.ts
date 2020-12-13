import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class ConfirmDialogService {
  private subject = new Subject<any>();


  confirmThis(title: string, message: string, yesFn: () => void, noFn: () => void,
              no: string = 'Nee', yes: string = 'Ja' ): any {
    console.log("confirmThis " + title);
    this.setConfirmation(title, message, yes, no, yesFn, noFn);

  }


  setConfirmation(messageTitle: string, message: string, yesMessage: string,
                  noMessage: string, yesFn: () => void, noFn: () => void): any {
    const that = this;
    this.subject.next({
      type: 'confirm',
      text: message,
      yes: yesMessage,
      no: noMessage,
      title: messageTitle,
      yesFn(): any {
        that.subject.next(); // This will close the modal
        yesFn();
      },
      noFn(): any {
        that.subject.next();
        noFn();
      }
    });

  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
