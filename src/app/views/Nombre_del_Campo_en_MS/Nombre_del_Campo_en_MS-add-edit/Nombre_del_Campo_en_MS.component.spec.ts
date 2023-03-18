import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Nombre_del_Campo_en_MSComponent } from './Nombre_del_Campo_en_MS.component';

describe('Nombre_del_Campo_en_MSComponent', () => {
  let component: Nombre_del_Campo_en_MSComponent;
  let fixture: ComponentFixture<Nombre_del_Campo_en_MSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Nombre_del_Campo_en_MSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Nombre_del_Campo_en_MSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

