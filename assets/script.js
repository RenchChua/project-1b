$(document).ready(function(){
  var Reversi = function (){
    this.boardArr = [[0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, -1, 0, 0, 0],
                    [0, 0, 0, -1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]];

    this.playerTurnNow = 1; //keeps track of which player's turn it is now

    this.notPlayerTurnNow = -1; //keeps track of who the player who isn't playing now

    this.positionPlaced = [0, 0]; //keeps track of the position that was selected

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

  Reversi.prototype.play = function(){

    // declaring variables needed;
    var boundBoardArr = this.boardArr;
    var positionPlacedArr = this.positionPlaced;

    var drawBoard = function(){
      // creates the squares
      for(i = 0; i < 64; i++){
        var square = $('<div>');
        square.addClass("square");
        square.attr('id', 'sq'+ Math.floor(i/8) + i % 8);
        if(Math.floor(i/8) === 0){
          square.addClass("top-row");
        }
        if(Math.floor(i/8) === 7){
          square.addClass("bottom-row");
        }
        if(i % 8 === 0){
          square.addClass("left-column");
        }
        if(i % 8 === 7){
          square.addClass("right-column");
        }
        $(".game-board-container").append(square);
      }
      // creates the space within each square
      for(i = 0; i < 64; i++){
        var $space = $('<div>');
        $space.addClass("space");
        $space.attr('id', 'sp' + Math.floor(i/8) + i % 8);
        $('.game-board-container').children().eq(i).append($space);
      }
    }; //end of draw board function

    drawBoard();

    // display pieces

    var displayPieces = function(){
      var black = "./assets/black.png";
      var white = "./assets/white.png";
      var spaceToFill = "";
      for (i = 0; i < 8; i ++){
        for (j = 0; j < 8; j ++){
          if(this.boardArr[i][j] === -1){
            spaceToFill = 'sp' + i + j;
            $("#" + spaceToFill).append($("<img>", {class: 'piece', src: black}));
          }
          if(this.boardArr[i][j] === 1){
            spaceToFill = 'sp' + i + j;
            $("#" + spaceToFill).append($("<img>", {class: 'piece', src: white}));
          }
        }
      }
    }.bind(this);

    displayPieces();

    // check which position has been selected by player, check if anything needs to change, update board display
    $(".space").click(function(){
      rowNum = parseInt(this.id.charAt(2));
      colNum = parseInt(this.id.charAt(3));
      positionPlacedArr = [rowNum, colNum];
      console.log(positionPlacedArr);
      checkChangeRight(positionPlacedArr);
      return positionPlacedArr;
    });

    // check whether the row right of the position selected needs to be changed

    var checkChangeRight = function(positionPlacedArr){
      rowNum = positionPlacedArr[0];
      colNum = positionPlacedArr[1];
      for(i = colNum; i < this.boardArr.length - 1; i++){
        if (this.boardArr[rowNum][i+1] === 0){
          return [];
        }else if ( this.boardArr[rowNum][i+1] === -1 ){
          this.toChangeRightArr.push(rowNum, i+1);
        }else if ( this.boardArr[rowNum][i+1] === 1){
          return;
        }
      }
      if(i === 7){
        this.toChangeRightArr = [];
      }
    }.bind(this);

    $(".test-btn").click(function(){
      displayPieces();
    }.bind(this));


  }; //end of prototype play function

var normalBoard = new Reversi();

normalBoard.play();

});
