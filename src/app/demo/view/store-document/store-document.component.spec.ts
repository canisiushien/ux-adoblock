import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDocumentComponent } from './store-document.component';

describe('StoreDocumentComponent', () => {
  let component: StoreDocumentComponent;
  let fixture: ComponentFixture<StoreDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
