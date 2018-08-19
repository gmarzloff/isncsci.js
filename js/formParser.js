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
        
            vac:        this.getToggleState('vac-check'),   // voluntary anal contraction
            dap:        this.getToggleState('dap-check'),   // deep anal pressure
            comments:   this.getScore('comments')
        };
        this.exam.results =  this.algorithm.generateResultsFor(this.exam)     // runs scoring algorithm
    }

    // populate the form with sample data
    populateFormWith(exam) {
        
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


    outputResults(){
        document.getElementById('out-nl-r-sensory').innerHTML   = this.exam.results.levels.right.sensory;
        document.getElementById('out-nl-l-sensory').innerHTML   = this.exam.results.levels.left.sensory;
        document.getElementById('out-nl-r-motor').innerHTML     = this.exam.results.levels.right.motor;
        document.getElementById('out-nl-l-motor').innerHTML     = this.exam.results.levels.left.motor;

        document.getElementById('out-nli').innerHTML            = this.exam.results.nli;
        document.getElementById('out-ais').innerHTML            = this.exam.results.grade;
        document.getElementById('out-complete').innerHTML       = this.exam.results.complete;

        document.getElementById('out-zpp-r-sensory').innerHTML  = this.exam.results.zpp.right.sensory;
        document.getElementById('out-zpp-l-sensory').innerHTML  = this.exam.results.zpp.left.sensory;
        document.getElementById('out-zpp-r-motor').innerHTML    = this.exam.results.zpp.right.motor;
        document.getElementById('out-zpp-l-motor').innerHTML    = this.exam.results.zpp.left.motor;
    }
}

var isncsci = new ISNCSCI();

// HTML Form Functions

document.getElementById("calculateButton").onclick = function() {
    isncsci.generateExamObject();
    isncsci.outputResults();
    // console.log(isncsci.exam.results);
};

for(let i=1;i<=5;i++){
    document.getElementById("test-scores-"+i).onclick = function(){ 
        isncsci.populateFormWith(sampleExams[i-1]);
    };
}
