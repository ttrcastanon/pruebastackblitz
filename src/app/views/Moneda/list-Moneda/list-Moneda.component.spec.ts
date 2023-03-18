import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMonedaComponent } from './list-Moneda.component';

describe('ListMonedaComponent', () => {
  let component: ListMonedaComponent;
  let fixture: ComponentFixture<ListMonedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMonedaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
