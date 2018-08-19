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
                pinPrick:   this.getScoreSet("right", "pp"),
                lowestNonKeyMuscle: this.getScore('RightLowestNonKeyMuscleWithMotorFunction')
            },
        
            left: {
                motor:      this.getScoreSet("left", "m"),
                lightTouch: this.getScoreSet("left","lt"),
                pinPrick:   this.getScoreSet("left", "pp"),
                lowestNonKeyMuscle: this.getScore('LeftLowestNonKeyMuscleWithMotorFunction')
            }, 
        
            comments:   this.getScore('comments'),

            results: {}                         // populated with calculateScore()
            vac:        this.getToggleState('vac-check'),   // voluntary anal contraction
            dap:        this.getToggleState('dap-check'),   // deep anal pressure
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

        document.getElementById("vac-check").checked = exam.vac;
        document.getElementById("dap-check").checked = exam.dap;

        document.getElementById("comments").innerHTML = exam.comments;
        document.getElementById("RightLowestNonKeyMuscleWithMotorFunction").value = exam.rightLowestNonKeyMuscleWithMotorFunction;
        document.getElementById("LeftLowestNonKeyMuscleWithMotorFunction").value = exam.leftLowestNonKeyMuscleWithMotorFunction;
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

    getToggleState(el) {
        return document.getElementById(el).checked;
    }

    // side "left" | "right"
    // scoresType "m" | "lt" | "pp" for motor, light touch, and pinprick
    getScoreSet(side,scoresType) {
        var prefix = side == "left" ? "l" : "r";
        var scores = {};
        if(scoresType == "m") {
            for(var i=0; i<this.algorithm.motorLevels.length;i++){
                scores[this.algorithm.motorLevels[i]] = this.getScore(prefix + '-m-' + this.algorithm.motorLevels[i]);
            }
        } else {
            for(var i=0; i<this.algorithm.spinalLevels.length;i++){
                scores[this.algorithm.spinalLevels[i]] = this.getScore(prefix + '-' + scoresType + '-' + this.algorithm.spinalLevels[i]);
            }
        }
        return scores;
    }

}


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
