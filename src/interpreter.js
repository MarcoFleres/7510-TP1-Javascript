var Interpreter = function () {

	var db;

    this.parseDB = function (params, paramss, paramsss) {

    }

    this.checkQuery = function (params) {

    	if(!db) throw "DB not initialized";

        return true;
    }

}

module.exports = Interpreter;
