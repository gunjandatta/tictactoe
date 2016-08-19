/// <reference path="../typings/tsd.d.ts" />
var TicTacToe = (function () {
    /* Constructor */
    function TicTacToe() {
        /* Variables */
        this._counter = 0;
        // Positions for winning the game
        this._winningPositions = [
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
        // Initialize the board
        this.initBoard();
    }
    /* Private Methods */
    TicTacToe.prototype.box_onClick = function (e) {
        var box = e.currentTarget;
        // Ensure there isn't a winner
        if (this._winnerFl) {
            return;
        }
        // Ensure it's the player's turn
        if (this._currentMove == "Y") {
            return;
        }
        // Ensure this hasn't been selected
        if ($(box).hasClass("x y")) {
            return;
        }
        // Set the class
        $(box).addClass("x");
        // Save this move
        var pos = box.id.replace(/pos_/g, "");
        this._board[pos[0]][pos[1]] = "X";
        // Check for a winner
        this.checkForWinner();
        // Update the next move
        this._currentMove = this._winnerFl ? "" : this._currentMove;
        // Increment the counter
        this._counter++;
        // See if we need to go
        if (!this._winnerFl) {
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
        if (++this._counter >= 9) {
            // Set the status message
            $("#statusMessage").text("Tie Game...");
        }
    };
    TicTacToe.prototype.canWin = function (board, currentMove, posX, posY) {
        if (posX === void 0) { posX = ""; }
        if (posY === void 0) { posY = ""; }
        var isCPU = (posX + posY).length == 2;
        var pos = "";
        var wins = 0;
        // Parse the winning positions
        for (var i = 0; i < this._winningPositions.length; i++) {
            var posX1 = this._winningPositions[i][0][0];
            var posY1 = this._winningPositions[i][0][1];
            var posX2 = this._winningPositions[i][1][0];
            var posY2 = this._winningPositions[i][1][1];
            var posX3 = this._winningPositions[i][2][0];
            var posY3 = this._winningPositions[i][2][1];
            // See if this is the computer's move
            if (isCPU) {
                // See if this winning position contains this move
                if ((posX1 == posX && posY1 == posY) ||
                    (posX2 == posX && posY2 == posY) ||
                    (posX3 == posX && posY3 == posY)) {
                    if ((board[posX1][posY1] + board[posX2][posX2] + board[posX3][posY3]).replace(/Y/g, "") == "") {
                        // Increment the wins
                        wins++;
                    }
                }
                // Continue the loop
                continue;
            }
            else {
                var value = currentMove + currentMove;
                // See if the current player can win
                if (board[posX1][posY1] == "" && board[posX2][posY2] + board[posX3][posY3] == value) {
                    // Set the winning position
                    pos = posX1 + posY1;
                }
                else if (board[posX2][posY2] == "" && board[posX1][posY1] + board[posX3][posY3] == value) {
                    // Set the winning position
                    pos = posX2 + posY2;
                }
                else if (board[posX3][posY3] == "" && board[posX1][posY1] + board[posX2][posY2] == value) {
                    // Set the winning position
                    pos = posX3 + posY3;
                }
                // Break if we can block
                if (pos != "") {
                    break;
                }
            }
        }
        // Return the winning position or number of wins
        return isCPU ? wins : pos;
    };
    TicTacToe.prototype.checkForWinner = function () {
        // Parse the winning positions
        for (var i = 0; i < this._winningPositions.length; i++) {
            var posX1 = this._winningPositions[i][0][0];
            var posY1 = this._winningPositions[i][0][1];
            var posX2 = this._winningPositions[i][1][0];
            var posY2 = this._winningPositions[i][1][1];
            var posX3 = this._winningPositions[i][2][0];
            var posY3 = this._winningPositions[i][2][1];
            // See if this position is a winner
            if (this._board[posX1][posY1] + this._board[posX2][posY2] + this._board[posX3][posY3] == this._currentMove + this._currentMove + this._currentMove) {
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
    };
    TicTacToe.prototype.clearBoard = function () {
        var _this = this;
        return function (e) {
            // Parse the rows
            for (var x = 0; x < 3; x++) {
                // Parse the columns
                for (var y = 0; y < 3; y++) {
                    // Remove the x and y classes
                    $("#pos_" + x + y).removeClass("x y");
                }
            }
            // Reset the global variables
            _this._board = _this.newBoard();
            _this._counter = 0;
            _this._currentMove = "";
            _this._winner = null;
            _this._winnerFl = false;
            // Clear the status message
            $("#statusMessage").text("");
            // Set the next move
            _this.setNextMove();
        };
    };
    TicTacToe.prototype.initBoard = function () {
        var _this = this;
        // Create the board
        this._board = this.newBoard();
        // Return a lambda expression to ensure use of 'this' being the class object.
        // e - event arg from jquery click event
        // Get the boxes and add a click event to them
        $(".box").click(function (e) { _this.box_onClick(e); });
        // Set the new game click event
        $("#btnNewGame").click(this.clearBoard());
        // Set the next move
        this.setNextMove();
    };
    TicTacToe.prototype.newBoard = function () {
        return [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    };
    TicTacToe.prototype.selectBestPosition = function () {
        var x, y = "";
        var mostWins = -1;
        // See if we can win or block
        var pos = this.canWin(this._board, this._currentMove) || this.canWin(this._board, "X");
        if (pos != "") {
            // Get the box
            var box_1 = document.querySelector("#pos_" + pos);
            if (box_1) {
                // Save this position
                this._board[pos[0]][pos[1]] = "Y";
                // Set the position
                $(box_1).addClass("y");
                return;
            }
        }
        // Copy the board
        var board = this._board.slice(0);
        // Parse the rows
        for (var i = 0; i < board.length; i++) {
            var wins = 0;
            // Parse the columns
            for (var j = 0; j < board[i].length; j++) {
                // See this position is empty
                if (board[i][j] != "") {
                    continue;
                }
                // Set this position
                board[i][j] = "Y";
                // See if this is the best position
                var numbOfWins = this.canWin(board, this._currentMove, i.toString(), j.toString());
                if (numbOfWins > mostWins) {
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
        var box = document.querySelector("#pos_" + x + y);
        if (box) {
            // Save this position
            this._board[x][y] = "Y";
            // Set the class
            $(box).addClass("y");
        }
    };
    TicTacToe.prototype.setNextMove = function () {
        // Update the next move
        this._currentMove = this._currentMove == "X" ? "Y" : "X";
        // Set the next move
        $("#nextMove").text(this._currentMove);
    };
    return TicTacToe;
}());
var tictactoe = new TicTacToe();
//# sourceMappingURL=tictactoe.js.map