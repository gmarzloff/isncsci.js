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
                motor:      this.getScoreSet("right", "m"),
                lightTouch: this.getScoreSet("right", "lt"),
                pinPrick:   this.getScoreSet("right", "pp")
            },
        
            left: {
                motor:      this.getScoreSet("left", "m"),
                lightTouch: this.getScoreSet("left","lt"),
                pinPrick:   this.getScoreSet("left", "pp")
            }, 
        
            vac: this.getScore('vac'),   // voluntary anal contraction
            dap: this.getScore('dap'),   // deep anal pressure
            comments: this.getScore('comments'),
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
                scores[this.algorithm.motorLevels[i]] = this.getScore(prefix + '-m-' + this.algorithm.motorLevels[i]);
            }
        } else {
            for(i=0; i<spinalLevels.length;i++){
                scores[this.algorithm.spinalLevels[i]] = this.getScore(prefix + '-' + scoresType + '-' + this.algorithm.spinalLevels[i]);
            }
        }
        return scores;
    }

}

Number.prototype.isPreserved = function(){
    return this > 0 ? true : false;
}();

var isncsci = new ISNCSCI();

document.getElementById("calculateButton").onclick = function() {
    isncsci.generateExamObject();
};
