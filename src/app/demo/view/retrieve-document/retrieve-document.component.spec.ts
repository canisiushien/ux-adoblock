import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveDocumentComponent } from './retrieve-document.component';

describe('RetrieveDocumentComponent', () => {
  let component: RetrieveDocumentComponent;
  let fixture: ComponentFixture<RetrieveDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrieveDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrieveDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
