# autonomousWalking
Autonomous walk to find the path from S to E using a new heuristic, in a labyrinth generated randomly

### see the example: example.html

## get Started

    lab = new Lab('labid',0.4,17,20);
    lab.create();

    // using findNexCase until  E (exit case)(distance == 0)  or impossible (distance== false)
    int = setInterval(function () {
            distance = lab.findNextCase();
            if (distance  === 0 || distance  === false) {
                if (distance  === false) {
                    alert("impossible");
                }
                else {
                    alert("success");
                }
                clearInterval(int);
            }
        }, 100);
