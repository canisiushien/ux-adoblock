import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateKeysPaireComponent } from './generate-keys-paire.component';

describe('GenerateKeysPaireComponent', () => {
  let component: GenerateKeysPaireComponent;
  let fixture: ComponentFixture<GenerateKeysPaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateKeysPaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateKeysPaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
