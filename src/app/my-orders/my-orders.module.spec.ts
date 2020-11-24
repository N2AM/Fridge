import { MyOrdersModule } from './my-orders.module';

describe('MyOrdersModule', () => {
  let myOrdersModule: MyOrdersModule;

  beforeEach(() => {
    myOrdersModule = new MyOrdersModule();
  });

  it('should create an instance', () => {
    expect(myOrdersModule).toBeTruthy();
  });
});
