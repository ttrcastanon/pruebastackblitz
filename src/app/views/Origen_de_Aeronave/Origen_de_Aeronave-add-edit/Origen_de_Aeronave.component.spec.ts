import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Origen_de_AeronaveComponent } from './Origen_de_Aeronave.component';

describe('Origen_de_AeronaveComponent', () => {
  let component: Origen_de_AeronaveComponent;
  let fixture: ComponentFixture<Origen_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Origen_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Origen_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

