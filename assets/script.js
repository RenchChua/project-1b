$(document).ready(function() {
  var Reversi = function() {
    this.boardArr = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, -1, 1, 0, 0, 0],
      [0, 0, 0, 1, -1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
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
    this.allPiecesToChangeArr = [];

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
      console.log("diagonal 4");
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
          }
        }
      }
      this.validPositions = checkValidPlacesArr;
      for(i = 0; i < this.boardArr.length; i ++){
        for(j = 0; j < this.boardArr.length; j ++){
          var sqToClearClass = "sq" + i + j;
          $('#' + sqToClearClass).removeClass('valid-positions1');
          $('#' + sqToClearClass).removeClass('valid-positions2');
        }
      }
      for(i = 0; i < this.validPositions.length; i ++){
        var spaceToHover = "sq" + this.validPositions[i][0] + this.validPositions[i][1];
        if (this.playerTurnNow === -1) {
          $("#" + spaceToHover).addClass('valid-positions1');
        }else{
          $("#" + spaceToHover).addClass('valid-positions2');
        }
      }
    }.bind(this);

    checkValidPlaces();

    // check which position has been selected by player, check if anything needs to change, update board display
    $(".space").click(function() {
      var rowNum = parseInt(this.id.charAt(2));
      var colNum = parseInt(this.id.charAt(3));
      updateBoardArr(rowNum, colNum);
    });

    $(".space").mouseover(function(){
      var rowNum = parseInt(this.id.charAt(2));
      var colNum = parseInt(this.id.charAt(3));
      positionPlacedArr = [rowNum, colNum];
      displayHint(rowNum, colNum);
    });

    var displayHint = function(rowNum, colNum){
      var hoveredSq = "#sq" + rowNum + colNum;
      checkValidPlaces();
      getAllPiecesToChange(rowNum, colNum);
      for(aNum = 0; aNum < this.validPositions.length; aNum ++){
        if(this.validPositions[aNum][0] === rowNum && this.validPositions[aNum][1] === colNum){
          if (this.boardArr[rowNum][colNum] === 0){
            for(i = 0; i < this.allPiecesToChangeArr.length; i ++){
              for(j = 0; j < this.allPiecesToChangeArr[i].length; j ++){
                var row = this.allPiecesToChangeArr[i][j][0];
                var col = this.allPiecesToChangeArr[i][j][1];
                var hintBorderSq = '#sq' + row + col;
                $(hintBorderSq).css("background-color", "rgba(44, 40, 40, 0.45)");
                $(hintBorderSq).css("border", "1px solid blue");
              }
            }
          }
        }
      }
      $(hoveredSq).mouseout(resetHint);
    }.bind(this);

    var resetHint = function(){
      for(i = 0; i < this.boardArr.length; i ++){
        for(j = 0; j < this.boardArr.length; j ++){
          var sqReset = "#sq" + i + j;
          $(sqReset).css("background-color", "rgba(255, 255, 230, 0.7)");
          $(sqReset).css("border", "1px solid black");
        }
      }
    }.bind(this);

    // update the boardArr and display new piece placed
    var updateBoardArr = function(rowNum, colNum) {
      var boardNeedsUpdate = false;
      checkValidPlaces();
      for(aNum = 0; aNum < this.validPositions.length; aNum ++){
        if(this.validPositions[aNum][0] === rowNum && this.validPositions[aNum][1] === colNum){
          if (this.boardArr[rowNum][colNum] === 0){
            checkPiecesToChange(rowNum, colNum);
            this.boardArr[rowNum][colNum] = this.playerTurnNow;
            displayNewPiece(rowNum, colNum);
            changePiecesEightDir(rowNum, colNum);
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
    }.bind(this);

    var getAllPiecesToChange = function(rowNum, colNum){
      this.allPiecesToChangeArr =[];
      checkPiecesToChange(rowNum, colNum);
      this.allPiecesToChangeArr.push(this.toChangeRightArr);
      this.allPiecesToChangeArr.push(this.toChangeLeftArr);
      this.allPiecesToChangeArr.push(this.toChangeUpArr);
      this.allPiecesToChangeArr.push(this.toChangeDownArr);
      this.allPiecesToChangeArr.push(this.toChangeDiagonal1);
      this.allPiecesToChangeArr.push(this.toChangeDiagonal2);
      this.allPiecesToChangeArr.push(this.toChangeDiagonal3);
      this.allPiecesToChangeArr.push(this.toChangeDiagonal4);
    }.bind(this);

    var flipPieces = function(){
      for(i = 0; i < this.allPiecesToChangeArr.length; i ++){
        for(j = 0; j < this.allPiecesToChangeArr[i].length; j ++){
          var row = this.allPiecesToChangeArr[i][j][0];
          var col = this.allPiecesToChangeArr[i][j][1];
          this.boardArr[row][col] = this.playerTurnNow;
          removePieces(row, col);
          displayNewPiece(row, col);
        }
      }
      this.allPiecesToChangeArr = [];
    }.bind(this);

    // change pieces in the eight directions that need to be changed
    var changePiecesEightDir = function(rowNum, colNum){
      getAllPiecesToChange(rowNum, colNum);
      flipPieces();
    }.bind(this)

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

    var checkEndByNoValidMoves = function(){
      if(this.noValidMoves === 2){
        $("#pop-up-background-container").css("display", "block");
        if(this.player1Score > this.player2Score){
            $("#pop-up-message").text("BLACK WON!");
        }else if(this.player1Score < this.player2Score){
          $("#pop-up-message").text("WHITE WON!");
        }else{
          $("#pop-up-message").text("IT'S A DRAW!");
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
        $(".close-text").text("GOT IT");
        $("#pop-up-close").click(function(){
          $("#pop-up-background-container").css("display", "none");
        });
        this.noValidMoves ++;
        switchPlayers();
        checkValidPlaces();
        checkEndByNoValidMoves();
      }else{
        checkValidPlaces();
        this.noValidMoves = 0;
        return;
      }
    }.bind(this);

    $(".restart-btn").click(function(){
      restartGame();
    });

  }; //end of prototype play function

  var normalBoard = new Reversi();

  normalBoard.play();

});
