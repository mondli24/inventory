import { TestBed } from '@angular/core/testing';

import { PickedItemsService } from './picked-items.service';

describe('PickedItemsService', () => {
  let service: PickedItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickedItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
