import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDocumentacion_de_AeronaveComponent } from './show-advance-filter-Documentacion_de_Aeronave.component';

describe('ShowAdvanceFilterDocumentacion_de_AeronaveComponent', () => {
  let component: ShowAdvanceFilterDocumentacion_de_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDocumentacion_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDocumentacion_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDocumentacion_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
