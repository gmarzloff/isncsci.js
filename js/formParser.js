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

    // populate the form with sample data
    populateFormWith(exam) {
        console.log(exam);
        for(let i=0; i < this.algorithm.motorLevels.length; i++){
            document.getElementById("r-m-"+this.algorithm.motorLevels[i]).value = exam.right.motor[this.algorithm.motorLevels[i]];
            document.getElementById("l-m-"+this.algorithm.motorLevels[i]).value = exam.left.motor[this.algorithm.motorLevels[i]];
        }

        for(let i=0; i < this.algorithm.spinalLevels.length - 1; i++){
            document.getElementById("r-lt-"+this.algorithm.spinalLevels[i]).value = exam.right.lightTouch[this.algorithm.spinalLevels[i]];
            document.getElementById("r-pp-"+this.algorithm.spinalLevels[i]).value = exam.right.pinPrick[this.algorithm.spinalLevels[i]];
            document.getElementById("l-lt-"+this.algorithm.spinalLevels[i]).value = exam.left.lightTouch[this.algorithm.spinalLevels[i]];
            document.getElementById("l-pp-"+this.algorithm.spinalLevels[i]).value = exam.left.pinPrick[this.algorithm.spinalLevels[i]];
        }

        document.getElementById("vaccheck").checked = exam.vac;
        document.getElementById("dapcheck").checked = exam.dap;

        document.getElementById("comments").innerHTML = exam.comments;
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


// HTML Form Functions

document.getElementById("calculateButton").onclick = function() {
    isncsci.generateExamObject();
};

for(let i=1;i<=5;i++){
    document.getElementById("test-scores-"+i).onclick = function(){ 
        isncsci.populateFormWith(sampleExams[i-1]);
    };
}
