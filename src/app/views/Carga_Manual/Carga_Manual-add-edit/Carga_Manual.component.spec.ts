import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Carga_ManualComponent } from './Carga_Manual.component';

describe('Carga_ManualComponent', () => {
  let component: Carga_ManualComponent;
  let fixture: ComponentFixture<Carga_ManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Carga_ManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Carga_ManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

