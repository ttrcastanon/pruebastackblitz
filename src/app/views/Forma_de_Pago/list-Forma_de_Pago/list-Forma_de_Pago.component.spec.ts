import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListForma_de_PagoComponent } from './list-Forma_de_Pago.component';

describe('ListForma_de_PagoComponent', () => {
  let component: ListForma_de_PagoComponent;
  let fixture: ComponentFixture<ListForma_de_PagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListForma_de_PagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListForma_de_PagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
