'use strict';


module.exports = function (ORMLoader) {

  describe('#loadFromORM(translator, [options])', function () {
    it('should accept a valid translator');
    it('should generate a valid schema');
    it('should generate a valid schema when options.relay is true');
    it('should not generate create mutations when options.mutations.create is false');
    it('should not generate update mutations when options.mutations.update is false');
    it('should not generate delete mutations when options.mutations.delete is false');
  });

};
