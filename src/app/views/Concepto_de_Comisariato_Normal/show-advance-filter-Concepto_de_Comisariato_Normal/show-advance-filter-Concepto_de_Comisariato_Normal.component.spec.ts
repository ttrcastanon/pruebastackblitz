import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent } from './show-advance-filter-Concepto_de_Comisariato_Normal.component';

describe('ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent', () => {
  let component: ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
