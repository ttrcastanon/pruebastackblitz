import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPasajerosComponent } from './list-Pasajeros.component';

describe('ListPasajerosComponent', () => {
  let component: ListPasajerosComponent;
  let fixture: ComponentFixture<ListPasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPasajerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
