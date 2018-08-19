/* 
examScorer.js

George Marzloff, MD | george@marzloffmedia.com 
Code written 2018

This file contains the scoring algorithm. 
It takes input as an exam object or JSON string
*/

class Results {

    constructor(){

        this.levels = {
            right: {
                lightTouch:         "",
                pinPrick:           "",
                motor:              "",
                sensory:            "",
                lowestNonKeyMuscle: "",
            },
        
            left: {
                lightTouch:         "",
                pinPrick:           "",
                motor:              "",
                sensory:            "",
                lowestNonKeyMuscle: "",
            },

            overall: {
                sensory:            "",
                motor:              ""
            }
        };

        this.nli = "";
        this.grade =  "";
        this.zpp = {};
        this.complete = "";
    }
}


String.prototype.isPreserved = function(){
    var n = Number(this);
    return n > 0 ? true : false;
}();


class Algorithm {

    constructor(){
        this.spinalLevels =  ['C2','C3','C4','C5','C6','C7','C8','T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12','L1','L2','L3','L4','L5','S1','S2','S3','S4-5','INT'];
        this.motorLevels =   ['C5','C6','C7','C8','T1','L2','L3','L4','L5','S1'];
    }

    generateResultsFor(exam){

        var results = new Results();

        var sides = ["right","left"];
        for(var i=0; i<sides.length; i++){
            // 1. Identify sensory levels
            var touchtype = ["lightTouch", "pinPrick"];
            for(var j=0; j<touchtype.length;j++){
                results.levels[sides[i]][touchtype[j]] = this.getMostCaudalIntactSensory(exam[sides[i]][touchtype[j]]);
            }

            results.levels[sides[i]].sensory = this.getRostralLevelFrom([
                results.levels[sides[i]].lightTouch,
                results.levels[sides[i]].pinPrick
            ]);

            // 2. Identify motor levels
            results.levels[sides[i]].motor = this.getMotorLevelOneSide(exam[sides[i]].motor, results.levels[sides[i]].sensory);
        }
        
        results.levels.overall.sensory = this.getRostralLevelFrom([
            results.levels.right.sensory,
            results.levels.left.sensory
        ]);

        results.levels.overall.motor = this.getRostralLevelFrom([
            results.levels.right.motor,
            results.levels.left.motor
        ]);
        

        // 3. Identify neurological level of injury
        results.nli = this.getRostralLevelFrom([
            results.levels.right.sensory,
            results.levels.right.motor,
            results.levels.left.sensory,
            results.levels.left.motor
        ]);

        //  4. Identify AIS Grade
        results.grade = this.identifyGrade(exam, results);

        //  5. Identify Complete Or Incomplete
        results.complete = this.getCompletenessLetter(results.grade);

        //  5. zpp 
        results.zpp = this.identifyZPP(exam, results);

        return results;
    }
    
    // input set from exam data as e.g. right.lightTouch 
    getMostCaudalIntactSensory(data){
        var mostCaudalIntact = 'C1';

        for(var i=0; i<this.spinalLevels.length - 1; i++){ // -1 to exclude 'INT'
            if(data[this.spinalLevels[i]] == "2"){
                mostCaudalIntact = this.spinalLevels[i];
            } else {
                return mostCaudalIntact;
            }
        }

        // for loop is complete without breaking for a 1 or 0, so the sense is intact.
        return "INT";
    }

    // receives light touch and pinprick caudal levels and gets most rostral one
    getRostralLevelFrom(data){
        var arr =[];
        for(var i=0; i<data.length; i++){
            arr[i]= this.spinalLevels.indexOf(data[i]);
        }
        return this.spinalLevels[Math.min(...arr)];
   }

    getMotorLevelOneSide(data, _overallSensoryLevel){

        // find most caudal level of 3 or 4 while all rostral levels to it are 5
        var motorLevel;

        for(var i=0; i<this.motorLevels.length; i++){

            if(data[this.motorLevels[i]]=="5" || data[this.motorLevels[i]]=="5*") {
                motorLevel = this.motorLevels[i];

            } else { // handle a weaker muscle level

                // edge cases: 
                // if sensorylevel==C4 and strength at C5 is 3 or 4, motor level = C5
                // if sensoryLevel==C3 (or higher) and strength at C5 is 3 or 4, motor level = sensoryLevel
                // if sensorylevel==L1 and strength at L2 is 3 or 4, motor level = L2
                // if sensoryLevel==T12 (or higher) and strength at L2 is 3 or 4 (and 5's C5-T1), motor level = sensoryLevel
                
                var indexOfCurrentLevelInSpinalLevelsArray = this.spinalLevels.indexOf(this.motorLevels[i]);
                var indexOfOverallSensoryLevelnSpinalLevelsArray = this.spinalLevels.indexOf(_overallSensoryLevel);

                // check if the spinal level is 1 above, equal or caudal to current level
                if(indexOfOverallSensoryLevelnSpinalLevelsArray >= indexOfCurrentLevelInSpinalLevelsArray - 1){
                    if (data[this.motorLevels[i]] >= 3) {
                        motorLevel = this.motorLevels[i];
                    } else {
                        motorLevel = this.spinalLevels[indexOfCurrentLevelInSpinalLevelsArray - 1];
                    }
                } else {
                    // sensory level is more than one level rostral to current level
                    motorLevel = _overallSensoryLevel;
                }
            }
        }
        return motorLevel;
    }


    identifyGrade(exam, results){
        var grade;
        var isMotorPreserved3LevelsBelow = this.isMotorPreservedThreeLevelsBelowMLIs(exam, results);

        // Check for A
        if (exam.vac == false && exam.dap == false && exam.right.lightTouch["S4-5"] == 0 && exam.right.pinPrick["S4-5"] == 0 && 
                exam.left.lightTouch["S4-5"] == 0 && exam.left.pinPrick["S4-5"] == 0){
            grade = "A";

        } 
        // Check for E: Normal
        // normal in all segments and after an actual SCI
        else if(results.levels.overall.sensory == "S4-5" && results.levels.overall.motor == "S4-5" && results.dap == true && results.vac == true){
            grade = "E";
        }
        // Check for B: Sensory Incomplete
        // Sensory is preserved at the sacral segments S4-5 (LT, PP or DAP) but not motor function (VAC), 
        // AND no motor function preserved more than three levels below motor level on either side of the body
        else if(this.isSacralSensoryPreserved(exam) && !exam.vac && 
                !isMotorPreserved3LevelsBelow){
            grade = "B";
        }

        // Check for C: Motor Incomplete
        // VAC is preserved OR sensory function preserved at S4-S5 by LT, PP or DAP
        // AND has sparing of motor function > 3 levels below ipsilateral motor level on either side of the body
        // (includes key or non-key muscle functions to determine motor incomplete status).
        // Less than half of key muscle functions below the single NLI have muscle grade >= 3
        if(exam.vac || (grade == "B" && isMotorPreserved3LevelsBelow)){

            // Check for D: Motor Incomplete
            // Satisfies Motor Incomplete + at least half of key muscle functions below single NLI >= 3
            if(this.areHalfOfKeyMusclesGreaterThanThree(exam,results.nli)){
                grade = "D"
            } else {
                grade = "C"
            }
        }

        return grade;
        
    }

    isSacralSensoryPreserved(exam){
        //checks if sensory is preserved below the NLI Including the sacral segments S4-5 (LT, PP or DAP)
        return  exam.right.lightTouch["S4-5"].isPreserved || exam.right.pinPrick["S4-5"].isPreserved ||
                exam.left.lightTouch["S4-5"].isPreserved || exam.left.pinPrick["S4-5"].isPreserved || exam.dap;
    }

    isMotorPreservedThreeLevelsBelowMLIs(exam, results){
         // "preserved" means 1 or better
        var sides = ["right","left"];

        var c5Index = this.spinalLevels.indexOf("C5");
        var t1Index = this.spinalLevels.indexOf("T1");
        var l2Index = this.spinalLevels.indexOf("L2");
        var s1Index = this.spinalLevels.indexOf("S1");

        for(var j=0; j<sides.length; j++){
            
            var threeSpinalLevelsDownIndex = this.spinalLevels.indexOf(results.levels[sides[j]].motor) + 3;
            var motorLevelsToEvaluate      = this.motorLevels;

            if(threeSpinalLevelsDownIndex > this.spinalLevels.length-1){
                threeSpinalLevelsDownIndex = this.spinalLevels.length-1;
            }

            if(threeSpinalLevelsDownIndex <= c5Index){
                // evaluate all key motor Levels without slicing motorLevelsToEvaluate[]

            } else if ((threeSpinalLevelsDownIndex > c5Index && threeSpinalLevelsDownIndex <= t1Index) ||
                        (threeSpinalLevelsDownIndex >= l2Index && threeSpinalLevelsDownIndex <= s1Index)){
                
                // take the subset of motorLevels caudal to threeSpinalLevelsDownIndex
                var equivalentMotorLevelIndex = this.motorLevels.indexOf(this.spinalLevels[threeSpinalLevelsDownIndex]);
                motorLevelsToEvaluate = motorLevelsToEvaluate.slice(equivalentMotorLevelIndex);

            }   // if threeSpinalLevelsDownIndex is caudal to S1, there are no motor levels left to test for preservation. 
                // Thus the AIS cannot be C, unless VAC is preserved.

            for(var i=0; i < motorLevelsToEvaluate.length; i++){
                if(motorLevelsToEvaluate[i].isPreserved){
                    return true;
                }
            }

            // finally check Non-Key Muscles 
            const nonKeyIndexInSpinalLevels = this.spinalLevels.indexOf(exam[sides[j]].lowestNonKeyMuscle);
            if(nonKeyIndexInSpinalLevels >= threeSpinalLevelsDownIndex){
                return true;
            }
        }
        return false;
    }

    areHalfOfKeyMusclesGreaterThanThree(exam,nli){
        // checks if at least half of key muscle functions below single NLI >= 3
        var totalMuscleLevelsCount = 0;
        var qualifyingMusclesCount = 0;
        var startingMuscleLevel;
        var indexOfNLI = this.spinalLevels.indexOf(nli);
        
        if(indexOfNLI < this.spinalLevels.indexOf("C5")){
            startingMuscleLevel = "C5";
        } else if(indexOfNLI > this.spinalLevels.indexOf("T1") && indexOfNLI < this.spinalLevels.indexOf("L2")){
            startingMuscleLevel = "L2";
        } else if(indexOfNLI > this.spinalLevels.indexOf("S1")){
            return false;
        } else {
            startingMuscleLevel = this.spinalLevels[indexOfNLI + 1];
        }

        var sides = ["right","left"];
        for(var j=0; j<sides.length; j++){
            for(var i = this.motorLevels.indexOf(startingMuscleLevel); i<this.motorLevels.length; i++){

                if(exam[sides[j]].motor[this.motorLevels[i]] >= 3){
                    qualifyingMusclesCount++;
                }
                totalMuscleLevelsCount++;
            }
        }
       
        return qualifyingMusclesCount >= totalMuscleLevelsCount/2;
    }

    getCompletenessLetter(grade){
        if(grade == "A") {
            return "C";
        } else if (grade == "B" || grade == "C" || grade == "D" || grade == "E" ){
            return "I";
        } else { 
            return "NA";
        }
    }

    identifyZPP(exam, results){

        var zpp_temp = {
            "right":    {"sensory": "NA", "motor": "NA"},
            "left":     {"sensory": "NA", "motor": "NA"}
        };

        if(results.grade == "A"){
            // find most caudal preservation
            var sides = ["right","left"];
            
            lrloop:
            for(var j=0; j<sides.length; j++){ 
        
                // Find most caudal key muscle preserved. ZPP = that one or MLI if MLI is more caudal.
                motorloop:
                for(var i=this.motorLevels.length-1; i>=0; i--){
                    if(exam[sides[j]].motor[this.motorLevels[i]] > 0){

                        // Is the motor level of impairment more caudal than this preserved level?
                        var mliIndexInSpinalLevels   = this.spinalLevels.indexOf(results.levels[sides[j]].motor);
                        var currentZPPInSpinalLevels = this.spinalLevels.indexOf(this.motorLevels[i]);
                        zpp_temp[sides[j]].motor     = mliIndexInSpinalLevels > currentZPPInSpinalLevels ? results.levels[sides[j]].motor : this.motorLevels[i];
                        break motorloop;
                    }
                }
                
                sensoryloop:
                for(var i=this.spinalLevels.length-2; i>=0; i--){   // length-2 to skip "INT" element
                    if(exam[sides[j]].lightTouch[this.spinalLevels[i]] > 0 || exam[sides[j]].pinPrick[this.spinalLevels[i]] > 0){
                        zpp_temp[sides[j]].sensory = this.spinalLevels[i];
                        break sensoryloop;
                    }
                }
            }

        }

        return zpp_temp;
    }

    
    // TODO: handle NT, ND levels
    

}