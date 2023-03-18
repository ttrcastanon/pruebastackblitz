import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNacionalidadComponent } from './list-Nacionalidad.component';

describe('ListNacionalidadComponent', () => {
  let component: ListNacionalidadComponent;
  let fixture: ComponentFixture<ListNacionalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNacionalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNacionalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
