
// sample-exams.js 
// A set of exam data to populate the form for testing


class SampleExam {

    constructor(arr){
        this.right = { motor:{}, lightTouch:{}, pinPrick:{} };
        this.left =  { motor:{}, lightTouch:{}, pinPrick:{} };
        this.vac = false;   // voluntary anal contraction
        this.dap = false,   // deep anal pressure
        this.comments = "";

        // arr takes the order from left to right columns of the standard form 
        // i.e. [[R motors],[R LT], [R PP], [L LT], [L PP], [L Motor], [VAC, DAP, R non-key, L non-key],comments]
        // this.data = this.createObject(arr);

        for(let i=0; i<this.motorLevels.length; i++){
            this.right.motor[this.motorLevels[i]]       = arr[0][i];
            this.left.motor[this.motorLevels[i]]        = arr[5][i];
        }

        for(let i=0; i<this.spinalLevels.length; i++){
            this.right.lightTouch[this.spinalLevels[i]] = arr[1][i];
            this.right.pinPrick[this.spinalLevels[i]]   = arr[2][i];
            this.left.lightTouch[this.spinalLevels[i]]  = arr[3][i];
            this.left.pinPrick[this.spinalLevels[i]]    = arr[4][i];
        }

        this.vac = arr[6][0];
        this.dap = arr[6][1];
        this.rightLowestNonKeyMuscleWithMotorFunction = arr[6][2];
        this.leftLowestNonKeyMuscleWithMotorFunction = arr[6][3];
        this.comments = arr[7];
    }

}

SampleExam.prototype.spinalLevels = ['C2','C3','C4','C5','C6','C7','C8','T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12','L1','L2','L3','L4','L5','S1','S2','S3','S4-5'];
SampleExam.prototype.motorLevels =  ['C5','C6','C7','C8','T1','L2','L3','L4','L5','S1'];


var sampleExams = [
    
    new SampleExam([
    [5,4,1,0,0,0,0,0,0,0],
    [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [5,4,1,0,0,0,0,0,0,0],
    [false,false,0,0],
    ""
    ]),

    new SampleExam([
    [3,1,0,0,0,0,0,0,0,0],
    [2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [4,2,0,0,0,0,0,0,0,0],
    [false,false,0,0],
    ""
    ]),

    new SampleExam([
    [5,5,5,5,5,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
    [5,5,5,5,5,2,1,1,0,0],
    [false,true,0,0],
    ""
    ]),
 
    new SampleExam([
    [5,5,5,5,5,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
    [5,5,5,5,5,2,0,0,0,0],
    [false,false,0,0],
    ""
    ]),

    new SampleExam([
    [5,5,4,0,0,0,0,0,0,0],
    [2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [5,3,3,0,0,0,0,0,0,0],
    [true,true,0,0],
    ""
    ])
];

