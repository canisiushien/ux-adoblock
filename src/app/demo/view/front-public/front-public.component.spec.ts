import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPublicComponent } from './front-public.component';

describe('FrontPublicComponent', () => {
  let component: FrontPublicComponent;
  let fixture: ComponentFixture<FrontPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontPublicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
