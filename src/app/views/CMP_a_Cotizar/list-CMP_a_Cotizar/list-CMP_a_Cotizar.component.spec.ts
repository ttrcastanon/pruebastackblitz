import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCMP_a_CotizarComponent } from './list-CMP_a_Cotizar.component';

describe('ListCMP_a_CotizarComponent', () => {
  let component: ListCMP_a_CotizarComponent;
  let fixture: ComponentFixture<ListCMP_a_CotizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCMP_a_CotizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCMP_a_CotizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
