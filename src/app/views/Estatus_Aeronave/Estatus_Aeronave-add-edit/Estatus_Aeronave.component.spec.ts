import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_AeronaveComponent } from './Estatus_Aeronave.component';

describe('Estatus_AeronaveComponent', () => {
  let component: Estatus_AeronaveComponent;
  let fixture: ComponentFixture<Estatus_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

