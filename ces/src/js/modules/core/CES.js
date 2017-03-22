class CES {
  constructor () {
    this.modules = [];
  }

  registerModule (Module) {
    this.modules.push(new Module());
  }

  initModules () {
    this.modules.forEach(module => {
      module.shouldInit() && module.go();
    });
  }
}

export default new CES();
