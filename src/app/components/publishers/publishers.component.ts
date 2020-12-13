import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Publisher} from '../../../store/publishers/models/publisher';
import {select, Store} from '@ngrx/store';
import {selectPublisherList} from '../../../store/publishers/selectors/publisher.selectors';
import {AppState} from '../../../store/app.state';
import {AddPublisher, DeletePublisher, GetPublishers} from '../../../store/publishers/actions/publisher.actions';
import {AddItem, DeleteItem} from '../../../store/items/actions/item.actions';
import {PublisherService} from '../../../store/publishers/services/publisher.service';
import {ConfirmDialogService} from '../../modules/confirm-dialog/confirm-dialog.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit {
  publisher$ = this.store.pipe(select(selectPublisherList));
  publisherForm: FormGroup;
  warningText: string;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private renderer: Renderer2,
              private publisherService: PublisherService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.publisherForm = this.formBuilder.group({
      publisher: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.store.dispatch(new GetPublishers());
  }

  onAddItemButton() {
    const publisher = {
      id: '',
      publisher: this.publisherForm.controls.publisher.value
    };
    this.store.dispatch(new AddPublisher(publisher));
    this.publisherForm.controls.publisher.setValue('');
  }

  onDeleteItem(content, publisher: Publisher, event) {

    this.publisherService.getNrOfBooks(publisher).subscribe(nrOfBooks => {
      if (nrOfBooks === 0) {
        this.renderer.setStyle(event.target, 'background', 'skyblue');
        this.store.dispatch(new DeletePublisher(publisher));
      } else {
        this.warningText = 'Uitgever is nog aan ' + nrOfBooks + ' boeken gekoppeld.';
        this.modalService.open(content, { size: 'lg' });
      }
    });
  }
}

