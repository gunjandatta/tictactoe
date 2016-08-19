/// <reference path="../typings/tsd.d.ts" />

class TicTacToe {
    /* Variables */
    private _counter:number = 0;
    private _currentMove:string;
    private _winnerFl:boolean;
    private _winner:string;

    // Board
    private _board:string[][];

    // Positions for winning the game
    private _winningPositions:string[][] = [
        // Diagonal
        ["00", "11", "22"],
        ["02", "11", "20"],
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
        // Initialize the board
        this.initBoard();
    }

    /* Private Methods */
    private box_onClick(e) {
            let box = e.currentTarget;

            // Ensure there isn't a winner
            if(this._winnerFl) { return; }

            // Ensure it's the player's turn
            if(this._currentMove == "Y") { return; }

            // Ensure this hasn't been selected
            if($(box).hasClass("x") || $(box).hasClass("y")) { return; }

            // Set the class
            $(box).addClass("x");

            // Save this move
            let pos = box.id.replace(/pos_/g, "");
            this._board[pos[0]][pos[1]] = "X";

            // Check for a winner
            this.checkForWinner();
            
            // Update the next move
            this._currentMove = this._winnerFl ? "" : this._currentMove;

            // Increment the counter
            this._counter++;
            
            // See if we need to go
            if(!this._winnerFl) {
                // Set the next move
                this.setNextMove();

                // Select the best position
                this.selectBestPosition();

                // Check for a winner
                this.checkForWinner();
                
                // Update the next move
                this._currentMove = this._winnerFl ? "" : this._currentMove;
            }
            
            // Set the next move
            this.setNextMove();

            // Increment the counter
            if(++this._counter >= 9) {
                // Set the status message
                $("#statusMessage").text("Tie Game...");
            }
    }

    private canWin(board:string[][], currentMove:string, posX:string = "", posY:string = "") {
        let isCPU = (posX + posY).length == 2;
        let pos = "";
        let wins = 0;

        // Parse the winning positions
        for(var i=0; i<this._winningPositions.length; i++) {
            let posX1 = this._winningPositions[i][0][0];
            let posY1 = this._winningPositions[i][0][1];
            let posX2 = this._winningPositions[i][1][0];
            let posY2 = this._winningPositions[i][1][1];
            let posX3 = this._winningPositions[i][2][0];
            let posY3 = this._winningPositions[i][2][1];

            // See if this is the computer's move
            if(isCPU) {
                // See if this winning position contains this move
                if(
                    (posX1 == posX && posY1 == posY) ||
                    (posX2 == posX && posY2 == posY) ||
                    (posX3 == posX && posY3 == posY)
                ) {
                    if((board[posX1][posY1] + board[posX2][posX2] + board[posX3][posY3]).replace(/Y/g, "") == "") {
                        // Increment the wins
                        wins++;
                    }
                }

                // Continue the loop
                continue;
            }
            else {
                let value = currentMove + currentMove;

                // See if the current player can win
                if(board[posX1][posY1] == "" && board[posX2][posY2] + board[posX3][posY3] == value) {
                    // Set the winning position
                    pos = posX1 + posY1;
                }
                else if(board[posX2][posY2] == "" && board[posX1][posY1] + board[posX3][posY3] == value) {
                    // Set the winning position
                    pos = posX2 + posY2;
                }
                else if(board[posX3][posY3] == "" && board[posX1][posY1] + board[posX2][posY2] == value) {
                    // Set the winning position
                    pos = posX3 + posY3;
                }

                // Break if we can block
                if(pos != "") { break; }
            }
        }

        // Return the winning position or number of wins
        return isCPU ? wins : pos;
    }

    private checkForWinner() {
        // Parse the winning positions
        for(var i=0; i<this._winningPositions.length; i++) {
            let posX1 = this._winningPositions[i][0][0];
            let posY1 = this._winningPositions[i][0][1];
            let posX2 = this._winningPositions[i][1][0];
            let posY2 = this._winningPositions[i][1][1];
            let posX3 = this._winningPositions[i][2][0];
            let posY3 = this._winningPositions[i][2][1];

            // See if this position is a winner
            if(this._board[posX1][posY1] + this._board[posX2][posY2] + this._board[posX3][posY3] == this._currentMove + this._currentMove + this._currentMove) {
                // Set the flag
                this._winnerFl = true;

                // Set the winner
                this._winner = this._currentMove;

                // Set the status message
                $("#statusMessage").text(this._currentMove == "X" ? "Congratulations you won!!!" : "Sorry, you lost...");

                // Break from the loop
                break;
            }
        }
    }

    private clearBoard() {
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
            this._board = this.newBoard();
            this._counter = 0;
            this._currentMove = "";
            this._winner = null;
            this._winnerFl = false;

            // Clear the status message
            $("#statusMessage").text("");

            // Set the next move
            this.setNextMove();
        }
    }
    
    private initBoard() {
        // Create the board
        this._board = this.newBoard();

        // Return a lambda expression to ensure use of 'this' being the class object.
        // e - event arg from jquery click event

        // Get the boxes and add a click event to them
        $(".box").click((e) => { this.box_onClick(e); });

        // Set the new game click event
        $("#btnNewGame").click(this.clearBoard());

        // Set the next move
        this.setNextMove();
    }

    private newBoard(): string[][] {
        return [
            ["","",""],
            ["","",""],
            ["","",""]
        ];
    }

    private selectBestPosition() {
        let x, y = "";
        let mostWins: number | string = -1;

        // See if we can win or block
        let pos = this.canWin(this._board, this._currentMove) || this.canWin(this._board, "X");
        if(pos != "") {
            // Get the box
            let box = document.querySelector("#pos_" + pos);
            if(box) {
                // Save this position
                this._board[pos[0]][pos[1]] = "Y";

                // Set the position
                $(box).addClass("y");
                return;
            }
        }

        // Copy the board
        let board = this._board.slice(0);

        // Parse the rows
        for(var i=0; i<board.length; i++) {
            let wins = 0;

            // Parse the columns
            for(var j=0; j<board[i].length; j++) {
                // See this position is empty
                if(board[i][j] != "") { continue; }

                // Set this position
                board[i][j] = "Y";

                // See if this is the best position
                let numbOfWins: number | string = this.canWin(board, this._currentMove, i.toString(), j.toString());
                if(numbOfWins > mostWins) {
                    // Set this position
                    x = i.toString();
                    y = j.toString();
                    mostWins = numbOfWins;
                }

                // Clear this position
                board[i][j] = "";
            }
        }

        // Set the best position
        let box = document.querySelector("#pos_" + x + y);
        if(box) {
            // Save this position
            this._board[x][y] = "Y";

            // Set the class
            $(box).addClass("y");
        }
    }

    private setNextMove() {
        // Update the next move
        this._currentMove = this._currentMove == "X" ? "Y" : "X";
        
        // Set the next move
        $("#nextMove").text(this._currentMove);
    }
}

var tictactoe = new TicTacToe();