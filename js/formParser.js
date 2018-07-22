/* 
formParser.js
Parses DOM to create ISNCSCI scores object 

George Marzloff, MD | george@marzloffmedia.com 
Code written 2018
*/

class ISNCSCI {
    constructor(){
        this.algorithm = new Algorithm();
    }

    /* parse the form and create an exam object */
    generateExamObject(){
        this.exam = {
            right: {
                motor:      getScoreSet("right", "m"),
                lightTouch: getScoreSet("right", "lt"),
                pinPrick:   getScoreSet("right", "pp")
            },
        
            left: {
                motor:      getScoreSet("left", "m"),
                lightTouch: getScoreSet("left","lt"),
                pinPrick:   getScoreSet("left", "pp")
            }, 
        
            vac: getScore('vac'),   // voluntary anal contraction
            dap: getScore('dap'),   // deep anal pressure
            comments: getScore('comments'),
            results: {}             // populated with calculateScore()
        };
    }

    calculateScore(){
        this.exam.results = this.algorithm.generateResultsFor(this.exam);
    }

    // Convenience function to pull raw score from DOM
    getScore(el) {
        var element = document.getElementById(el);
        if(element !== null) {
            return element.value;
        }else{
            return "";
        }
    }

    // side "left" | "right"
    // scoresType "m" | "lt" | "pp" for motor, light touch, and pinprick
    getScoreSet(side,scoresType) {
        var prefix = side == "left" ? "l" : "r";
        var scores = {};
        if(scoresType == "m") {
            for(i=0; i<this.algorithm.motorLevels.length;i++){
                scores[this.algorithm.motorLevels[i]] = getScore(prefix + '-m-' + this.algorithm.motorLevels[i]);
            }
        } else {
            for(i=0; i<spinalLevels.length;i++){
                scores[this.algorithm.spinalLevels[i]] = getScore(prefix + '-' + scoresType + '-' + this.algorithm.spinalLevels[i]);
            }
        }
        return scores;
    }

}


var isncsci = new ISNCSCI();

document.getElementById("calculateButton").onclick = function() {
    isncsci.generateExamObject();
};
