import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDetails } from './food-details';

describe('FoodDetails', () => {
  let component: FoodDetails;
  let fixture: ComponentFixture<FoodDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
