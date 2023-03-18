import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConsecutivo_Numero_de_vueloComponent } from './list-Consecutivo_Numero_de_vuelo.component';

describe('ListConsecutivo_Numero_de_vueloComponent', () => {
  let component: ListConsecutivo_Numero_de_vueloComponent;
  let fixture: ComponentFixture<ListConsecutivo_Numero_de_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConsecutivo_Numero_de_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConsecutivo_Numero_de_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
