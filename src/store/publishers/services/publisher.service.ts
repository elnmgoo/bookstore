import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Publisher, PublisherAdapter} from '../models/publisher';
import {map} from 'rxjs/operators';

@Injectable()
export class PublisherService {
  publishersUrl = environment.apiUrl + '/uitgevers';

  constructor(private httpClient: HttpClient, private adapter: PublisherAdapter) {
  }

  getPublishers(): Observable<Publisher[]> {
    return this.httpClient.get<Publisher[]>(this.publishersUrl).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  addPublisher(publisher: Publisher): Observable<Publisher> {
    return this.httpClient.put<Publisher>(this.publishersUrl, Publisher.getUitgever(publisher)).pipe(
      map((item) => this.adapter.adapt(item))
    );
  }

  deletePublisher(publisher: Publisher): Observable<Publisher> {
    return this.httpClient.delete<Publisher>(this.publishersUrl + '/' + publisher.id).pipe(
      map((item) => publisher));
  }

  getNrOfBooks(publisher: Publisher){
    return this.httpClient.get<number>(this.publishersUrl + '/' + publisher.id + '/nrofbooks');
  }
}
