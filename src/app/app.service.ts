import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  private userLoggedIn = new Subject<boolean>();
  private counter = new Subject<number>();
  private continueSession = new Subject<boolean>();

  constructor() {
    this.userLoggedIn.next(false);
    this.counter.next(0);
    this.continueSession.next(false);
  }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  setCounter(counter: number) {
    this.counter.next(counter);
  }

  getCounter(): Observable<number> {
    return this.counter.asObservable();
  }

  setContinueSession(continueSession: boolean) {
    this.continueSession.next(continueSession);
  }

  getContinueSession(): Observable<boolean> {
    return this.continueSession.asObservable();
  }

}