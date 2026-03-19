import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeKeysPairComponent } from './revoke-keys-pair.component';

describe('RevokeKeysPairComponent', () => {
  let component: RevokeKeysPairComponent;
  let fixture: ComponentFixture<RevokeKeysPairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeKeysPairComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevokeKeysPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
