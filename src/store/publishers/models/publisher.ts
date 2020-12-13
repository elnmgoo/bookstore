import {Injectable} from '@angular/core';
import {Adapter} from '../../../app/Adapter';

export class Publisher {
  id: string;
  publisher: string;

  constructor(id: string, publisher: string) {
    this.id = id;
    this.publisher = publisher;
  }

  public static getUitgever(publisher: Publisher) {
    const uitgever: any = new Object();
    uitgever.uitgeverid = publisher.id;
    uitgever.naam = publisher.publisher;
    return uitgever;
  }
}


@Injectable({
  providedIn: 'root',
})
export class PublisherAdapter implements Adapter<Publisher> {
  adapt(item: any): Publisher {
    return new Publisher(item.uitgeverid, item.naam);
  }
}
