import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConcepto_de_Comisariato_NormalComponent } from './list-Concepto_de_Comisariato_Normal.component';

describe('ListConcepto_de_Comisariato_NormalComponent', () => {
  let component: ListConcepto_de_Comisariato_NormalComponent;
  let fixture: ComponentFixture<ListConcepto_de_Comisariato_NormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConcepto_de_Comisariato_NormalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConcepto_de_Comisariato_NormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
