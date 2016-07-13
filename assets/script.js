$(document).ready(function() {
  var Reversi = function() {
    this.boardArr = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [-1, -1, -1, -1, -1, -1, -1, 0],
      [1, -1, 1, 1, 1, 1, -1, 1],
      [1, 1, 1, -1, 1, 1, 1, 1],
      [-1, 1, 1, 1, -1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, -1],
      [1, 1, 1, 1, 1, 0, 1, 0],
      [1, 0, 1, 1, 1, 1, 1, 1]
    ];

    this.player1Score = 2;

    this.player2Score = 2;

    this.turnNumber = 1;

    this.playerTurnNow = -1; //keeps track of which player's turn it is now

    this.notPlayerTurnNow = 1; //keeps track of who the player who isn't playing now

    this.positionPlaced = [0, 0]; //keeps track of the position that was selected

    this.validPositions = [];

    this.noValidMoves = 0;

    // keeps track of the position of pieces that need to change based on the position that was selected
    this.toChangeRightArr = [];
    this.toChangeLeftArr = [];
    this.toChangeUpArr = [];
    this.toChangeDownArr = [];
    this.toChangeDiagonal1 = [];
    this.toChangeDiagonal2 = [];
    this.toChangeDiagonal3 = [];
    this.toChangeDiagonal4 = [];

  }; //end of prototype

  Reversi.prototype.play = function() {

    // declaring variables needed;
    var boundBoardArr = this.boardArr;
    var positionPlacedArr = this.positionPlaced;
    var boundPlayerTurn = this.playerTurnNow;
    var boundPlayerNotTurn = this.notPlayerTurnNow;
    var black = "./assets/black.png";
    var white = "./assets/white.png";

    var drawBoard = function() {
      // creates the squares
      for (i = 0; i < 64; i++) {
        var square = $('<div>');
        square.addClass("square");
        square.attr('id', 'sq' + Math.floor(i / 8) + i % 8);
        if (Math.floor(i / 8) === 0) {
          square.addClass("top-row");
        }
        if (Math.floor(i / 8) === 7) {
          square.addClass("bottom-row");
        }
        if (i % 8 === 0) {
          square.addClass("left-column");
        }
        if (i % 8 === 7) {
          square.addClass("right-column");
        }
        $(".game-board-container").append(square);
      }
      // creates the space within each square
      for (i = 0; i < 64; i++) {
        var $space = $('<div>');
        $space.addClass("space");
        $space.attr('id', 'sp' + Math.floor(i / 8) + i % 8);
        $('.game-board-container').children().eq(i).append($space);
      }
    }; //end of draw board function

    drawBoard();

    // display pieces

    var displayPieces = function() {
      var spaceToFill = "";
      for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
          if (this.boardArr[i][j] === -1) {
            spaceToFill = 'sp' + i + j;
            $("#" + spaceToFill).append($("<img>", {
              class: 'piece',
              src: black
            }));
          } else if (this.boardArr[i][j] === 1) {
            spaceToFill = 'sp' + i + j;
            $("#" + spaceToFill).append($("<img>", {
              class: 'piece',
              src: white
            }));
          }
        }
      }
    }.bind(this);

    displayPieces();

    // check whether the pieces in the same row to the right of the position selected needs to be changed
    var checkChangeRight = function(rowNum, colNum) {
      this.toChangeRightArr = [];
      for (i = colNum; i < this.boardArr.length - 1; i++) {
        if (this.boardArr[rowNum][i + 1] === 0) {
          this.toChangeRightArr = [];
          return;
        } else if (this.boardArr[rowNum][i + 1] === this.notPlayerTurnNow) {
            this.toChangeRightArr.push([rowNum, i + 1]);
        } else if (this.boardArr[rowNum][i + 1] === this.playerTurnNow) {
          return;
        }
      }
      if (i === 7) {
        this.toChangeRightArr = [];
      }
    }.bind(this);

    // check whether the pieces in the same row to the left of the position selected needs to be changed
    var checkChangeLeft = function(rowNum, colNum){
      this.toChangeLeftArr = [];
      for(i = colNum; i > 0; i-- ){
        if (this.boardArr[rowNum][i-1] === 0){
          this.toChangeLeftArr = [];
          return;
        }else if (this.boardArr[rowNum][i-1] === this.notPlayerTurnNow ){
          this.toChangeLeftArr.push([rowNum, i-1]);
        }else if (this.boardArr[rowNum][i-1] === this.playerTurnNow){
          return;
        }
      }
      if(i === 0){
        this.toChangeLeftArr = [];
      }
    }.bind(this);

    // check whether the pieces in the column below the position selected needs to be changed
    var checkChangeDown = function(rowNum, colNum) {
      this.toChangeDownArr = [];
      for (i = rowNum; i < this.boardArr.length - 1; i++) {
        if (this.boardArr[i + 1][colNum] === 0) {
          this.toChangeDownArr = [];
          return;
        } else if (this.boardArr[i + 1][colNum] === this.notPlayerTurnNow) {
          this.toChangeDownArr.push([i + 1 , colNum]);
        } else if (this.boardArr[i + 1][colNum] === this.playerTurnNow) {
          return;
        }
      }
      if (i === 7) {
        this.toChangeDownArr = [];
      }
    }.bind(this);

    // check whether the pieces in the column above the position selected needs to be changed
    var checkChangeUp = function(rowNum, colNum) {
      this.toChangeUpArr = [];
      for (i = rowNum; i > 0; i--) {
        if (this.boardArr[i - 1][colNum] === 0) {
          this.toChangeUpArr = [];
          return;
        } else if (this.boardArr[i - 1][colNum] === this.notPlayerTurnNow) {
          this.toChangeUpArr.push([i - 1 , colNum]);
        } else if (this.boardArr[i - 1][colNum] === this.playerTurnNow) {
          return;
        }
        if (i === 1) {
          this.toChangeUpArr = [];
        }
      }
    }.bind(this);

    // check whether the pieces to be checked is on the board

    var isOnBoard = function(x, y){ //Idea of checking whether the piece to check is on board is from Angeline.
      if ( (x >= 0 && y >= 0) && ( x < 8 && y < 8 ) ){
        return true;
      }
    };

    // check whether the pieces in the diagonal to bottom right of the position selected needs to be changed
    var checkDiagonal1 = function(rowNum, colNum){
      this.toChangeDiagonal1 = [];
      for( i = 1; i < this.boardArr.length; i ++ ){
        if( isOnBoard(rowNum + i , colNum + i ) ){
          if( this.boardArr[rowNum + i][colNum + i] === this.notPlayerTurnNow ){
            this.toChangeDiagonal1.push([rowNum + i , colNum + i ]);
          }else if(this.boardArr[rowNum + i ][colNum + i ] === this.playerTurnNow){
            return;
          }else if ( this.boardArr[rowNum + i ][colNum + i ] === 0 ) {
            this.toChangeDiagonal1 = [];
            return;
          }
        }else if (isOnBoard(rowNum + i - 1, colNum + i - 1)) {
          if(this.boardArr[rowNum + i - 1][colNum + i -1] !== this.playerTurnNow){
              this.toChangeDiagonal1 = [];
              return;
          }else{
            this.toChangeDiagonal1 = [];
            return;
          }
        }
      }
    }.bind(this);

    // check whether the pieces in the diagonal to top right of the position selected needs to be changed
    var checkDiagonal2 = function(rowNum, colNum){
      this.toChangeDiagonal2 = [];
      for( i = 1; i < this.boardArr.length; i ++ ){
        if( isOnBoard(rowNum - i , colNum + i ) ){
          if( this.boardArr[rowNum - i][colNum + i] === this.notPlayerTurnNow ){
            this.toChangeDiagonal2.push([rowNum - i , colNum + i ]);
          }else if(this.boardArr[rowNum - i ][colNum + i ] === this.playerTurnNow){
            return;
          }else if ( this.boardArr[rowNum - i ][colNum + i ] === 0 ) {
            this.toChangeDiagonal2 = [];
            return;
          }
        }else if (isOnBoard(rowNum - i + 1, colNum + i - 1)) {
          if(this.boardArr[rowNum - i + 1][colNum + i -1] !== this.playerTurnNow){
              this.toChangeDiagonal2 = [];
              return;
          }else{
            this.toChangeDiagonal2 = [];
            return;
          }
        }
      }
    }.bind(this);

    // check whether the pieces in the diagonal to bottom left of the position selected needs to be changed
    var checkDiagonal3 = function(rowNum, colNum){
      this.toChangeDiagonal3 = [];
      for( i = 1; i < this.boardArr.length; i ++ ){
        if( isOnBoard(rowNum + i , colNum - i ) ){
          if( this.boardArr[rowNum + i][colNum - i] === this.notPlayerTurnNow ){
            this.toChangeDiagonal3.push([rowNum + i , colNum - i ]);
          }else if(this.boardArr[rowNum + i ][colNum - i ] === this.playerTurnNow){
            return;
          }else if ( this.boardArr[rowNum + i ][colNum - i ] === 0 ) {
            this.toChangeDiagonal3 = [];
            return;
          }
        }else if (isOnBoard(rowNum + i - 1, colNum - i + 1)) {
          if(this.boardArr[rowNum + i - 1][colNum - i + 1] !== this.playerTurnNow){
              this.toChangeDiagonal3 = [];
              return;
          }else{
            this.toChangeDiagonal3 = [];
            return;
          }
        }
      }
    }.bind(this);

    // check whether the pieces in the diagonal to top left of the position selected needs to be changed
    var checkDiagonal4 = function(rowNum, colNum){
      this.toChangeDiagonal4 = [];
      for( i = 1; i < this.boardArr.length; i ++ ){
        if( isOnBoard(rowNum - i , colNum - i ) ){
          if( this.boardArr[rowNum - i][colNum - i] === this.notPlayerTurnNow ){
            this.toChangeDiagonal4.push([rowNum - i , colNum - i ]);
          }else if(this.boardArr[rowNum - i ][colNum - i ] === this.playerTurnNow){
            return;
          }else if ( this.boardArr[rowNum - i ][colNum - i ] === 0 ) {
            this.toChangeDiagonal4 = [];
            return;
          }
        }else if (isOnBoard(rowNum - i + 1, colNum - i + 1)) {
          if(this.boardArr[rowNum - i + 1][colNum - i + 1] !== this.playerTurnNow){
              this.toChangeDiagonal4 = [];
              return;
          }else{
            this.toChangeDiagonal4 = [];
            return;
          }
        }
      }
    }.bind(this);


    // fill array of valid places to position
    var checkValidPlaces = function() {
      var checkValidPlacesArr = [];
      for (row = 0; row < 8; row++) {
        for (col = 0; col < 8; col++) {
          if (this.boardArr[row][col] === 0) {
            checkChangeRight(row, col);
            if (this.toChangeRightArr.length > 0) {
              checkValidPlacesArr.push([row, col]);
            }
            checkChangeLeft(row, col);
            if (this.toChangeLeftArr.length > 0){
              checkValidPlacesArr.push([row,col]);
            }
            checkChangeDown(row, col);
            if (this.toChangeDownArr.length > 0){
              checkValidPlacesArr.push([row,col]);
            }
            checkChangeUp(row, col);
            if (this.toChangeUpArr.length > 0){
              checkValidPlacesArr.push([row,col]);
            }
            checkDiagonal1(row, col);
            if (this.toChangeDiagonal1.length > 0){
              checkValidPlacesArr.push([row,col]);
            }
            checkDiagonal2(row, col);
            if (this.toChangeDiagonal2.length > 0){
              checkValidPlacesArr.push([row,col]);
            }
            checkDiagonal3(row, col);
            if (this.toChangeDiagonal3.length > 0){
              checkValidPlacesArr.push([row,col]);
            }
            checkDiagonal4(row, col);
            if (this.toChangeDiagonal4.length > 0){
              checkValidPlacesArr.push([row,col]);
            }
            // this.toChangeRightArr = [];
            // this.toChangeLeftArr = [];
            // this.toChangeDownArr = [];
            // this.toChangeUpArr = [];
            // this.toChangeDiagonal1 = [];
            // this.toChangeDiagonal2 = [];
            // this.toChangeDiagonal3 = [];
            // this.toChangeDiagonal4 = [];
          }
        }
      }
      this.validPositions = checkValidPlacesArr;
    }.bind(this);

    checkValidPlaces();

    // check which position has been selected by player, check if anything needs to change, update board display
    $(".space").click(function() {
      var validPlacesArr = [];
      var rowNum = 0;
      var colNum = 0;
      rowNum = parseInt(this.id.charAt(2));
      colNum = parseInt(this.id.charAt(3));
      positionPlacedArr = [rowNum, colNum];
      updateBoardArr(rowNum, colNum);
    });

    $(".restart-btn").click(function(){
      console.log("clicked");
      restartGame();
    });

    // update the boardArr and display new piece placed
    var updateBoardArr = function(rowNum, colNum) {
      var boardNeedsUpdate = false;
      checkValidPlaces();
      for(aNum = 0; aNum < this.validPositions.length; aNum ++){
        if(this.validPositions[aNum][0] === rowNum && this.validPositions[aNum][1] === colNum){
          if (this.boardArr[rowNum][colNum] === 0){
            if (this.turnNumber % 2 === 0) {
              // can put all the checks into one separate function to make this DRYer
              checkPiecesToChange(rowNum, colNum);
              // console.log("to change up is " + this.toChangeUpArr);
              // console.log("to change down is " + this.toChangeDownArr);
              // console.log("to change left is " + this.toChangeLeftArr);
              // console.log("to change right is " + this.toChangeRightArr);
              // console.log("to change diagonal1 is " + this.toChangeDiagonal1);
              // console.log("to change diagonal2 is " + this.toChangeDiagonal2);
              // console.log("to change diagonal3 is " + this.toChangeDiagonal3);
              // console.log("to change diagonal4 is " + this.toChangeDiagonal4);
              this.boardArr[rowNum][colNum] = 1;
              displayNewPiece(rowNum, colNum);
              // can put all the changes into one separate function to make this DRYer
              changePiecesEightDir(rowNum, colNum);
            } else {
              // can put all the checks into one separate function to make this DRYer
              checkPiecesToChange(rowNum, colNum);
              // console.log("to change up is " + this.toChangeUpArr);
              // console.log("to change down is " + this.toChangeDownArr);
              // console.log("to change left is " + this.toChangeLeftArr);
              // console.log("to change right is " + this.toChangeRightArr);
              // console.log("to change diagonal1 is " + this.toChangeDiagonal1);
              // console.log("to change diagonal2 is " + this.toChangeDiagonal2);
              // console.log("to change diagonal3 is " + this.toChangeDiagonal3);
              // console.log("to change diagonal4 is " + this.toChangeDiagonal4);
              this.boardArr[rowNum][colNum] = -1;
              displayNewPiece(rowNum, colNum);
              // can put all the changes into one separate function to make this DRYer
              changePiecesEightDir(rowNum, colNum);
            }
          }
          boardNeedsUpdate = true;
        }
      }

      checkScore();

      if (boardNeedsUpdate === true){
        switchPlayers();
        checkEndByNoValidMoves();
      }
    }.bind(this);

    var checkEndByNoValidMoves = function(){
      if(this.noValidMoves === 2){
        $("#pop-up-background-container").css("display", "block");
        if(this.player1Score > this.player2Score){
            $("#pop-up-message").text("BLACK WON!");
        }else if(this.player1Score < this.player2Score){
          $("#pop-up-message").text("WHITE WON!");
        }else{
          $("#pop-up-message").text("ITS A DRAW!");
        }
        $(".close-text").text("AGAIN!");
        $("#pop-up-close").click(function(){
          $("#pop-up-background-container").css("display", "none");
          restartGame();
          checkValidPlaces();
        });
        return;
      }else if(this.validPositions.length === 0){
        $("#pop-up-background-container").css("display", "block");
        $("#pop-up-message").text("NO VALID MOVES. MOVING ON...");
        $("#pop-up-close").click(function(){
          $("#pop-up-background-container").css("display", "none");
        });
        this.noValidMoves ++;
        switchPlayers();
        checkValidPlaces();
        checkEndByNoValidMoves();

      }else{
        this.noValidMoves = 0;
        return;
      }
    }.bind(this);

    // change turns function

    var switchPlayers = function(){
      if (this.turnNumber % 2 === 0){
        this.playerTurnNow = -1;
        this.notPlayerTurnNow = 1;
      } else{
        this.playerTurnNow = 1;
        this.notPlayerTurnNow = -1;
      }
      if( this.playerTurnNow === 1){
        $(".turn-text-container").text("White's Turn");
      }else{
        $(".turn-text-container").text("Black's Turn");
      }
      checkValidPlaces();
      this.turnNumber++;
    }.bind(this);

    // display new piece placed

    var displayNewPiece = function(rowNum, colNum) {
      var spaceToFill = 'sp' + rowNum + colNum;
      if (this.boardArr[rowNum][colNum] === -1) {
        $("#" + spaceToFill).append($("<img>", {
          class: 'piece',
          src: black
        }));
      } else if (this.boardArr[rowNum][colNum] === 1) {
        $("#" + spaceToFill).append($("<img>", {
          class: 'piece',
          src: white
        }));
      }
    }.bind(this);

    //  remove pieces
    var removePieces = function(rowNum, colNum) {
      var spaceToRemove = 'sp' + rowNum + colNum;
      $("#" + spaceToRemove).html("");
    };

    // check which positions to flip upon piece placed
    var checkPiecesToChange = function(rowNum, colNum){
      checkChangeRight(rowNum, colNum);
      checkChangeLeft(rowNum, colNum);
      checkChangeDown(rowNum, colNum);
      checkChangeUp(rowNum, colNum);
      checkDiagonal1(rowNum, colNum);
      checkDiagonal2(rowNum, colNum);
      checkDiagonal3(rowNum, colNum);
      checkDiagonal4(rowNum, colNum);
    };

    // change pieces in the eight directions that need to be changed
    var changePiecesEightDir = function(rowNum, colNum){
      changeRight(rowNum);
      changeLeft(rowNum);
      changeDown(colNum);
      changeUp(colNum);
      changeDiagonal1();
      changeDiagonal2();
      changeDiagonal3();
      changeDiagonal4();
    };

    // flip all the pieces that need to be flipped

    var changeRight = function(rowNum){ // sure this can be refactored to keep DRY
      if (this.toChangeRightArr.length > 0){
        for(i = 0; i < this.toChangeRightArr.length; i++ ){
          this.boardArr[rowNum][this.toChangeRightArr[i][1]] = this.playerTurnNow;
          removePieces(rowNum, this.toChangeRightArr[i][1]);
          displayNewPiece(rowNum, this.toChangeRightArr[i][1]);
        }
      }
      this.toChangeRightArr = [];
    }.bind(this);

    var changeLeft = function(rowNum){ //sure this can be refactored to keep DRY...
      if (this.toChangeLeftArr.length > 0){
        for(i = 0; i < this.toChangeLeftArr.length; i++ ){
          this.boardArr[rowNum][this.toChangeLeftArr[i][1]] = this.playerTurnNow;
          removePieces(rowNum, this.toChangeLeftArr[i][1]);
          displayNewPiece(rowNum, this.toChangeLeftArr[i][1]);
        }
      }
      this.toChangeRightArr = [];
    }.bind(this);

    var changeDown = function(colNum){ //sure this can be refactored to keep DRY...
      if (this.toChangeDownArr.length > 0){
        for(i = 0; i < this.toChangeDownArr.length; i++ ){
          this.boardArr[this.toChangeDownArr[i][0]][colNum] = this.playerTurnNow;
          removePieces(this.toChangeDownArr[i][0], colNum);
          displayNewPiece(this.toChangeDownArr[i][0], colNum);
        }
      }
      this.toChangeDownArr = [];
    }.bind(this);

    var changeUp = function(colNum){ //sure this can be refactored to keep DRY...
      if (this.toChangeUpArr.length > 0){
        for(i = 0; i < this.toChangeUpArr.length; i++ ){
          this.boardArr[this.toChangeUpArr[i][0]][colNum] = this.playerTurnNow;
          removePieces(this.toChangeUpArr[i][0], colNum);
          displayNewPiece(this.toChangeUpArr[i][0], colNum);
        }
      }
      this.toChangeUpArr = [];
    }.bind(this);

    var changeDiagonal1 = function(){
      if (this.toChangeDiagonal1.length > 0){
        for(i = 0; i < this.toChangeDiagonal1.length; i++ ){
          this.boardArr[this.toChangeDiagonal1[i][0]][this.toChangeDiagonal1[i][1]] = this.playerTurnNow;
          removePieces(this.toChangeDiagonal1[i][0], this.toChangeDiagonal1[i][1]);
          displayNewPiece(this.toChangeDiagonal1[i][0], this.toChangeDiagonal1[i][1]);
        }
      }
    }.bind(this);

    var changeDiagonal2 = function(){
      if (this.toChangeDiagonal2.length > 0){
        for(i = 0; i < this.toChangeDiagonal2.length; i++ ){
          this.boardArr[this.toChangeDiagonal2[i][0]][this.toChangeDiagonal2[i][1]] = this.playerTurnNow;
          removePieces(this.toChangeDiagonal2[i][0], this.toChangeDiagonal2[i][1]);
          displayNewPiece(this.toChangeDiagonal2[i][0], this.toChangeDiagonal2[i][1]);
        }
      }
    }.bind(this);

    var changeDiagonal3 = function(){
      if (this.toChangeDiagonal3.length > 0){
        for(i = 0; i < this.toChangeDiagonal3.length; i++ ){
          this.boardArr[this.toChangeDiagonal3[i][0]][this.toChangeDiagonal3[i][1]] = this.playerTurnNow;
          removePieces(this.toChangeDiagonal3[i][0], this.toChangeDiagonal3[i][1]);
          displayNewPiece(this.toChangeDiagonal3[i][0], this.toChangeDiagonal3[i][1]);
        }
      }
    }.bind(this);

    var changeDiagonal4 = function(){
      if (this.toChangeDiagonal4.length > 0){
        for(i = 0; i < this.toChangeDiagonal4.length; i++ ){
          this.boardArr[this.toChangeDiagonal4[i][0]][this.toChangeDiagonal4[i][1]] = this.playerTurnNow;
          removePieces(this.toChangeDiagonal4[i][0], this.toChangeDiagonal4[i][1]);
          displayNewPiece(this.toChangeDiagonal4[i][0], this.toChangeDiagonal4[i][1]);
        }
      }
    }.bind(this);

    var checkScore = function(){
      this.player1Score = 0;
      this.player2Score = 0;
      for(i = 0; i < this.boardArr.length; i ++){
        for(j = 0; j < this.boardArr.length; j ++){
          if(this.boardArr[i][j] === -1){
            this.player1Score ++;
          }else if(this.boardArr[i][j] === 1){
            this.player2Score ++;
          }
        }
      }
      $('.black-score-text-container').text('SCORE: ' + this.player1Score);
      $('.white-score-text-container').text('SCORE: ' + this.player2Score);
    }.bind(this);

    var restartGame = function(){
      for(i = 0; i < this.boardArr.length; i ++){
        console.log(i);
        for(j = 0; j < this.boardArr.length; j ++){
          this.boardArr[i][j] = 0;
          removePieces(i, j);
        }
      }
      for(i = 1; i < 3; i ++){
        this.boardArr[2 + i][2 + i] = -1;
        displayNewPiece(2 + i, 2 + i);
        this.boardArr[5 - i][2 + i] = 1;
        displayNewPiece(5 - i, 2 + i);
      }
      checkScore();
      this.playerTurnNow = -1;
      this.notPlayerTurnNow = 1;
      this.turnNumber = 1;
      this.noValidMoves = 0;
      $(".turn-text-container").text("Black's Turn");
    }.bind(this);
  }; //end of prototype play function

  var normalBoard = new Reversi();

  normalBoard.play();

});
