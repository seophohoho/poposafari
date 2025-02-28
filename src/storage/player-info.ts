export interface Location {
  overworld: string;
  x: number;
  y: number;
}

export class PlayerInfo {
  private nickname!: string;
  private gender!: 'boy' | 'girl';
  private avatar!: 1 | 2 | 3 | 4;
  private location!: Location;
  private pet!: string | null;
  private money!: number;
  private partySlot: string[] = [];

  private readonly MaxSlot: number = 6;

  constructor() {}

  setup() {
    //TODO: 외부로부터 사용자 데이터를 받아오자.
    this.nickname = '운영자';
    this.gender = 'girl';
    this.avatar = 1;
    this.location = {
      overworld: '000',
      x: 10,
      y: 10,
    };
    this.pet = null;
    this.money = 100000;
  }

  getNickname() {
    return this.nickname;
  }

  getGender() {
    return this.gender;
  }

  getAvatar() {
    return this.avatar;
  }

  getLocation() {
    return this.location;
  }

  getPet() {
    return this.pet;
  }

  getMoney() {
    return this.money;
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
  }

  setGender(gender: 'boy' | 'girl') {
    this.gender = gender;
  }

  setAvatar(avatar: 1 | 2 | 3 | 4) {
    this.avatar = avatar;
  }

  setLocation(location: Location) {
    if (!this.location) {
      this.location = { overworld: '', x: 0, y: 0 };
    }

    this.location.overworld = location.overworld;
    this.location.x = location.x;
    this.location.y = location.y;
  }

  setPet(pet: string | null) {
    this.pet = pet;
  }

  setMoney(money: number) {
    this.money = money;
  }

  useMoney(cost: number) {
    if (cost && this.money < cost) {
      return false;
    }

    this.setMoney(this.money - cost);
    return true;
  }

  getPartySlot() {
    return this.partySlot;
  }

  addPartySlot(pokedex: string): boolean {
    if (this.partySlot.length === this.MaxSlot) {
      return false;
    }

    this.partySlot.push(pokedex);

    return true;
  }

  hasPartySlot(pokedex: string) {
    return this.partySlot.includes(pokedex);
  }

  removePartSlot(pokedex: string): boolean {
    const index = this.partySlot.indexOf(pokedex);

    if (index !== -1) {
      this.partySlot.splice(index, 1);
      return true;
    }

    return false;
  }
}
