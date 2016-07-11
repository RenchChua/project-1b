$(document).ready(function(){
  var Reversi = function (){
    this.boardArr = [[1, 0, 0, 0, 0, 0, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, -1, 0, 0],
                    [0, 0, 0, 0, 0, 0, -1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 1, 0, 0, 0, 0]];

    this.playerTurnNow = 1; //keeps track of which player's turn it is now

    this.notPlayerTurnNow = -1; //keeps track of who the player who isn't playing now

    this.positionPlaced = [3, 4]; //keeps track of the position that was selected

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

    


  }; //end of prototype play function

var normalBoard = new Reversi();

normalBoard.play();

});
