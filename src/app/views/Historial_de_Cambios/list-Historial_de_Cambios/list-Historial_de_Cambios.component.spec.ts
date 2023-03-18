import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHistorial_de_CambiosComponent } from './list-Historial_de_Cambios.component';

describe('ListHistorial_de_CambiosComponent', () => {
  let component: ListHistorial_de_CambiosComponent;
  let fixture: ComponentFixture<ListHistorial_de_CambiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHistorial_de_CambiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHistorial_de_CambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
