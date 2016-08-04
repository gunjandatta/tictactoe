/// <reference path="../typings/tsd.d.ts" />

class TicTacToe {
    /* Variables */
    private _currentMove:string;
    private _winnerFl:boolean;
    private _winner:string;

    // Positions for winning the game
    private _winningPositions:string[][] = [
        // Diagonal
        ["00", "11", "22"],
        ["02", "11", "02"],
        // Horizontal
        ["00", "01", "02"],
        ["10", "11", "12"],
        ["20", "21", "22"],
        // Vertical
        ["00", "10", "20"],
        ["01", "11", "21"],
        ["02", "12", "22"],
    ];

    /* Constructor */
    constructor() {
        // Initialize the variables
        this._currentMove = "X";

        // Initialize the board
        this.initBoard();
    }

    /* Private Methods */
    private get box_onClick() {
        // Return a lambda expression to ensure use of 'this' being the class object.
        // e - event arg from jquery click event
        return (e) => {
            let isX = this._currentMove == "X";
            let box = e.currentTarget;

            // Ensure there isn't a winner
            if(this._winnerFl) { return; }

            // Ensure this hasn't been selected
            if($(box).hasClass("x y")) { return; }

            // Set the class
            $(box).addClass(isX ? "x" : "y");

            // Check for a winner
            this.checkForWinner();

            // Update the next move
            this._currentMove = isX ? "Y" : "X";
            this._currentMove = this._winnerFl ? "" : this._currentMove;

            // Set the next move
            this.setNextMove();
        };
    }

    private checkForWinner() {
        // Parse the winning positions
        for(var i=0; i<this._winningPositions.length; i++) {
            let positions = this._winningPositions[i];

            // Get the boxes
            let box1 = $("#pos_" + positions[0]);
            let box2 = $("#pos_" + positions[1]);
            let box3 = $("#pos_" + positions[2]);

            // See if there is a winner
            if(($(box1).hasClass("x") && $(box2).hasClass("x") && $(box3).hasClass("x")) || ($(box1).hasClass("y") && $(box2).hasClass("y") && $(box3).hasClass("y"))) {
                // Set the flag
                this._winnerFl = true;

                // Set the winner
                this._winner = this._currentMove;

                // Set the status message
                $("#statusMessage").text("Congratulations " + this._winner + " is the winner!!!");

                // Break from the loop
                break;
            }
        }
    }

    private get clearBoard() {
        return (e) => {
            // Parse the rows
            for(var x=0; x<3;x++) {
                // Parse the columns
                for(var y=0; y<3;y++) {
                    // Remove the x and y classes
                    $("#pos_" + x + y).removeClass("x y");
                }
            }

            // Reset the global variables
            this._currentMove = "X";
            this._winner = null;
            this._winnerFl = false;

            // Clear the status message
            $("#statusMessage").text("");

            // Set the next move
            this.setNextMove();
        }
    }
    
    private initBoard() {
        // Get the boxes and add a click event to them
        $(".box").click(this.box_onClick);

        // Set the new game click event
        $("#btnNewGame").click(this.clearBoard);

        // Set the next move
        this.setNextMove();
    }

    private setNextMove() {
        // Set the next move
        $("#nextMove").text(this._currentMove);
    }
}

var tictactoe = new TicTacToe();