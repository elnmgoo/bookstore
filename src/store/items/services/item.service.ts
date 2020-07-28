import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Item} from '../models/item';

@Injectable()
export class ItemService {
  itemsUrl = environment.apiUrl + '/items';

  constructor(private httpClient: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.itemsUrl);
  }

  addItem(item: Item): Observable<Item>{
    return this.httpClient.put<Item>(this.itemsUrl, item);
  }

  deleteItem(item: Item): Observable<Item>{
    return this.httpClient.delete<Item>(this.itemsUrl + '/' + item.id);
  }
}
