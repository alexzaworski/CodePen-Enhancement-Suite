import conditionChecker from '../../utils/conditionChecker';
export default class CESModule {
  constructor () {
    this.conditions = {};
  }

  shouldInit () {
    return conditionChecker.check(this.conditions);
  }

  go () {
    console.log(`No go func defined on ${this.constructor.name}`);
  }
}
