var Interpreter = function () {


    var db;

    this.parseDB = function (dbLines) {

        db = {
          facts : {},
            rules : {}
        };

        for(var i = 0 ; i < dbLines.length ; i++) {

            var line = dbLines[i];

            if(match = matchFact(line)) {
                //console.log(" Fact > ", match);

                (db.facts[match.verb] = db.facts[match.verb] || []).push(match.parameters);

            } else if(match = matchRule(line)) {
                //console.log(" Rule > ", match);

                db.rules[match.verb] = match;

            } else {
                throw `Invalid Line :${i} (${line})`
            }

        }

        //console.log(JSON.stringify(db, null, ' '));

    }

    this.checkQuery = function (query) {

        if(!db) throw "DB not initialized";

        console.log("Evaluating " + query);

        var match = matchQuery(query);

        if(!match) throw "Invalid Query: " + query;

        var queryParameters = match.parameters;

        if(db.facts[match.verb]) {
            // Buscamos en la base de datos un fact con los mismos parámetros
            // console.log("Checking query agains facts with parameters: " + JSON.stringify(match.parameters));
            // console.log("Searching fact parameters: " + JSON.stringify(db.facts[match.verb]));

            return undefined != db.facts[match.verb].find(parameters => {
                if(parameters.length != queryParameters.length) return false;
                return queryParameters.every( (parameter,index) => parameter == parameters[index] );
            });

        } else if(rule = db.rules[match.verb]) {

            console.log("Evaluating rule: " + JSON.stringify(rule));

            //Mapeamos los parámetros de la query con los de la regla

            if(rule.parameters.length != queryParameters.length) return false;

            var parameterMap = {};

            rule.parameters.forEach((element, index) => {
                parameterMap[element] = queryParameters[index];
            });

            console.log("Parameter Map: " + JSON.stringify(parameterMap));

            return rule.conditions.every(condition => {

                console.log("Evaluating condition: " + JSON.stringify(condition));

                return this.checkQuery(`${condition.verb}(${condition.parameters.map(e => parameterMap[e]).join(",")})`)


            });


            console.log("It is a Rule!");
        }

        return true;
    }

    function matchQuery(line) {

        //La regex coincide casi con la de facts, pero podemos necesitar cambiarlas independientemente.
        var match = line.match('^ *\([a-zA-Z]+\)\\(\([a-z ,]*?\)\\) *$');

        if(!match) return null;

        return {
            verb : match[1],
            parameters : match[2].split(/ *, */)
        }

    }

    function matchFact(line) {
        var match = line.match('^ *\([a-zA-Z]+\)\\(\([a-z ,]*?\)\\)\. *$');

        if(!match) return null;

        return {
            verb : match[1],
            parameters : match[2].split(/ *, */)
        }

    }

    function matchRule(line) {

        var match = line.match(' *\([a-zA-Z]+\)\\(\([A-Z ,]*?\)\\) *:- *\(\(?: *\(?:[a-zA-Z]+\)\\(\(?:[A-Z ,]*?\)\\),? *\)+\)\.')

        if(!match) return null;

        var conditions = match[3].split(/ *,(?![^(]*\)) */);    // Split por comas que no estén entre paréntesis

        conditions = conditions.map(condition =>  {
            //console.log("Parsing Condition : " + condition);
            var match = condition.match(' *\([a-zA-Z]+\)\\(\([a-zA-Z ,]*?\)\\) *');

            if(!match) return null;

            return {
                verb : match[1],
                parameters : match[2].split(/ *, */)
            }
        });

        //console.log("Condiciones: " + JSON.stringify(conditions));

        return {
            verb : match[1],
            parameters : match[2].split(/ *, */),
            conditions
        }

    }

}

module.exports = Interpreter;
