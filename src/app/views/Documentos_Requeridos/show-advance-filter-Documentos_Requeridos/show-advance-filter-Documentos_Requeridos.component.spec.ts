import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDocumentos_RequeridosComponent } from './show-advance-filter-Documentos_Requeridos.component';

describe('ShowAdvanceFilterDocumentos_RequeridosComponent', () => {
  let component: ShowAdvanceFilterDocumentos_RequeridosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDocumentos_RequeridosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDocumentos_RequeridosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDocumentos_RequeridosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
