import { Bag } from '../object/bag';
import { ITEM } from '../enums/item';

describe('Bag Tests', () => {
  let bag: Bag;

  beforeEach(() => {
    bag = new Bag();
    bag.setup();
  });

  test('아이템 추가 테스트.', () => {
    bag.addItems('001', 3);
    expect(Object.keys(bag.getPockets(ITEM.POKEBALL))).toContain('001');
    expect(bag.getItem('001')?.getStock()).toBe(7);
  });

  test('아이템 사용 후 stock 감소 테스트1.', () => {
    bag.useItem('001', 4);
    expect(bag.getItem('001')).toBeUndefined();
  });

  test('아이템 사용 후 stock 감소 테스트2.', () => {
    bag.addItems('006', 4);
    bag.useItem('006', 1);
    expect(bag.getItem('006')?.getStock()).toBe(3);

    bag.useItem('006', 2);
    expect(bag.getItem('006')?.getStock()).toBe(1);

    bag.useItem('006', 2);
    expect(bag.getItem('006')?.getStock()).toBeUndefined();
  });

  test('아이템 등록 테스트.', () => {
    bag.registerItem('001', 1);
    expect(bag.getItem('001')?.getRegister()).toBe(1);

    bag.registerItem('002', 1);
    expect(bag.getItem('002')?.getRegister()).toBe(1);
    expect(bag.getItem('001')?.getRegister()).toBeNull();

    bag.registerItem('003', 1);
    expect(bag.getItem('003')?.getRegister()).toBe(1);
    bag.registerItem('003', 2);
    expect(bag.getItem('003')?.getRegister()).toBe(2);
  });
});
