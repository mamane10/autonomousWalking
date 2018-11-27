var colorsByType = ["white", "black", "green", "red"];
var lineStep = [1, 1, 1, 0, 0, -1, -1, -1];
var columnStep = [1, 0, -1, 1, -1, 1, 0, -1];



/*
labirenid: (string) the id of labyrinth tag
alpha : (float) density of  walls
nb_l : (int) number of lines
nb_c : (int) number of columns

 */

var Lab= function(labirentId,alpha,nb_l,nb_c) {
    document.getElementById(labirentId).className+=' labirent88889';
    this.htmlLabirent='';
    this.labirentId=labirentId;
    if (nb_l>2&&nb_c>2) {
        this.nb_column = nb_c;
        this.nb_line = nb_l;
        this.alpha = alpha;
        this.canCreate= true;

    }else
    {
        this.canCreate=false;
        console.log("-> Number of columns and rows should be more than 2");
    }
}


Lab.prototype.setRandomWalls=function()
{
    for (i = 0; i < this.nb_line; i++) {
        for (j = 0; j < this.nb_column; j++) {
            if (Math.random() < this.alpha)
                this.setWall(j, i);
        }
    }
}

Lab.prototype.getIdBypPosition = function (x, y) {
    return x + '_' + y;
}

Lab.prototype.getCaseElement= function(x,y){
    return document.getElementById(this.getIdBypPosition(x, y));
}
Lab.prototype.getCaseTypeByPosition = function (x, y) {
    return this.getCaseElement(x,y).dataset.type;
}

Lab.prototype.getRow = function (i) {
    rows = ['fa fa-arrow-right', 'fa fa-arrow-down', 'fa fa-arrow-down', 'fa fa-arrow-right', 'fa fa-arrow-left', 'fa fa-arrow-up', 'fa fa-arrow-up', 'fa fa-arrow-up'];
    rowsStyles = ['rotateZ(45deg)', '', 'rotateZ(45deg)', '', '', 'rotateZ(45deg)', '', 'rotateZ(-45deg)'];
    return '<i class="indication ' + rows[i] + '" style="-webkit-transform:' + rowsStyles[i] + ';"></i>';
}


Lab.prototype.setRandomPositionByType = function (type) {
    var y = Math.floor(Math.random() * Math.floor(this.nb_line - 1));
    var x = Math.floor(Math.random() * Math.floor(this.nb_column - 1));
    var e = this.getCaseElement(x,y);
    e.style.backgroundColor=colorsByType[type];
    e.dataset.type=type;
    return [x, y];
}


Lab.prototype.setWall = function (x, y) {
    var type=1;
    e = this.getCaseElement(x,y);
    e.style.backgroundColor=colorsByType[type];
    e.dataset.type = type;
}



Lab.prototype.createStartAndExitCases = function () {
    this.startedPostion = this.setRandomPositionByType(3);
    this.getCaseElement(this.startedPostion[0], this.startedPostion[1]).innerText='S' // start
    endPositionTmp = this.setRandomPositionByType(2); //
    while (endPositionTmp[0] == this.startedPostion[0] && endPositionTmp[1] == this.startedPostion[1]) {
        e =  this.getCaseElement(this.startedPostion[0], this.startedPostion[1]);
        e.style.backgroundColor= colorsByType[3];
        e.dataset.type = '3';
        endPositionTmp= this.setRandomPositionByType(2);
    }
    this.exitPosition = endPositionTmp;
    this.curPosition = this.startedPostion;
    this.getCaseElement(this.exitPosition[0], this.exitPosition[1]).innerText='E' // exit;
}

Lab.prototype.getDistance = function (p1, p2) {
    return Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2);
}

Lab.prototype.setNbVisite = function (x, y) {
    e = this.getCaseElement(x,y);
    e.dataset.nbvisited = e.dataset.nbvisited + 1;
}


Lab.prototype.getNbVisite = function (x, y) {
    return this.getCaseElement(x,y).dataset.nbvisited;
}

Lab.prototype.create=function () {
    if (this.canCreate)
    {
        lines='';
        for (i = 0; i < this.nb_line; i++) {
            line = '';
            for (j = 0; j < this.nb_column; j++) {
                line += '<span onclick="checkUserIsOk(' + j + ',' + i + ');"data-nbvisited="0" data-type="0" data-x="' + j + '" data-y="' + i + '" id="' + this.getIdBypPosition(j, i) + '" class="case"></span>';
            }
            lines += '<div class="line">' + line + '</div>'
        }
        this.htmlLabirent=lines;

        document.getElementById(this.labirentId).innerHTML =lines;
        this.setRandomWalls();
        this.createStartAndExitCases();
        this.htmlLabirent= document.getElementById(this.labirentId).innerHTML;

    }else
    {
        document.getElementById(this.labirentId).innerHTML='<i>impossible to create the labirent, see the console log.</i>';
    }

}

Lab.prototype.reload=function()
{
    document.getElementById(this.labirentId).innerHTML = this.htmlLabirent;
    this.curPosition = this.startedPostion;

}


/*Returns the remaining distance between the current position and E if it
 is possible,otherwise it will return false.
 */
Lab.prototype.findNextCase = function () {
    distance = this.getDistance([0, 0], [this.nb_line-1, this.nb_column-1])*10;
    p = 0;
    finded = false;
    for (i = 0; i < 8; i++) {
        X = this.curPosition[0] + columnStep[i];
        Y = this.curPosition[1] + lineStep[i];
        if (X < this.nb_column && X >= 0 && Y >= 0 && Y < this.nb_line) {
            if (this.getCaseTypeByPosition(X, Y) == '0')
            {

                nb_vistes = this.getNbVisite(X, Y);
                if (nb_vistes<10)
                {
                    if (nb_vistes!=0) distance_tmp = this.getDistance([X,Y],this.exitPosition)*nb_vistes;
                    else distance_tmp = this.getDistance([X,Y],this.exitPosition)/Math.sqrt(this.nb_column*this.nb_line);
                    if (distance > distance_tmp)
                    {
                        distance = distance_tmp;
                        finded = true;
                        p = i;
                    }
                }

            }
            else
            {

                if (this.getCaseTypeByPosition(X, Y) === '2') // finded
                {
                    finded = true;
                    this.curPosition = [this.curPosition[0] + columnStep[i], this.curPosition[1] + lineStep[i]];
                    return 0;
                }
            }

        }

    }

    if (finded) {

        this.setNbVisite(this.curPosition[0] + columnStep[p], this.curPosition[1] + lineStep[p]);
        this.curPosition = [this.curPosition[0] + columnStep[p], this.curPosition[1] + lineStep[p]];
        this.getCaseElement(this.curPosition[0], this.curPosition[1]).innerHTML=this.getRow(p);
        return distance;

    }
    else {
        return false; // impossible
    }

}