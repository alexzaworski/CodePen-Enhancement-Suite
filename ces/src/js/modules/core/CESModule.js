import conditionChecker from '../../utils/conditionChecker';
export default class CESModule {
  constructor() {
    this.conditions = {};
  }

  shouldInit() {
    return conditionChecker.check(this.conditions);
  }

  go() {
    console.error(`No go func defined on ${this.constructor.name}`);
  }
}
