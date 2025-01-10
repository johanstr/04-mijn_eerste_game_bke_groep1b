/***************************************************
 *  Boter-Kaas-Eieren
 *  ------------------------------------------------
 *  Versie:     2025
 **************************************************/

// GLOBALE VARIABELEN
let element_turn_number;
let element_turn_player_image;
let element_score_player1;
let element_score_player2;
let element_rounds_played;
let element_round_time;
let element_game_button;

let element_cells;

window.onload = function () {
   element_turn_number = document.querySelector('.turn-player');
   element_turn_player_image = document.querySelector('#img-turn-player');
   element_score_player1 = document.querySelector('#score-player-one');
   element_score_player2 = document.querySelector('#score-player-two');
   element_rounds_played = document.querySelector('.info-round p:last-child');
   
};



