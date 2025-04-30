import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveDocumentPublicComponent } from './retrieve-document-public.component';

describe('RetrieveDocumentPublicComponent', () => {
  let component: RetrieveDocumentPublicComponent;
  let fixture: ComponentFixture<RetrieveDocumentPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrieveDocumentPublicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrieveDocumentPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
