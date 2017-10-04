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
                console.log(" Fact > ", match);

                (db.facts[match.verb] = db.facts[match.verb] || []).push(match.parameters);

            } else if(match = matchRule(line)) {
                console.log(" Rule > ", match);

                db.rules[match.verb] = match;

            } else {
                throw `Invalid Line :${i} (${line})`
            }

        }

        console.log(JSON.stringify(db, null, ' '));

    }

    this.checkQuery = function (params) {

        if(!db) throw "DB not initialized";

        return true;
    }

    function matchFact(line) {
        var match = line.match('^ *\([a-z]+\)\\(\([a-z ,]*?\)\\)\. *$');

        if(!match) return null;

        return {
            verb : match[1],
            parameters : match[2].split(/ *, */)
        }

    }

    function matchRule(line) {

        var match = line.match(' *\([a-zA-Z]+\)\\(\([A-Z ,]*?\)\\) *:- *\(\(?: *\(?:[a-zA-Z]+\)\\(\(?:[A-Z ,]*?\)\\),? *\)+\)\.')

        if(!match) return null;

        return {
            verb : match[1],
            parameters : match[2].split(/ *, */),
            conditions : match[3].split(/ *,(?![^(]*\)) */)
        }

    }

}

module.exports = Interpreter;
