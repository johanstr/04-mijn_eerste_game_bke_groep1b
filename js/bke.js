/***************************************************
 *  Boter-Kaas-Eieren
 *  ------------------------------------------------
 *  Versie:     2025
 **************************************************/

// ------------------
// GLOBALE VARIABELEN
// ------------------

// ELEMENTS
let element_turn_number;        // Tonen van het nummer van de speler die aan de beurt is
let element_turn_image;         // Tonen van de afbeelding van de speler die aan de beurt is
let element_score_player1;      // Tonen van de score van speler 1
let element_score_player2;      // Tonen van de score van speler 2
let element_round_time;         // Tonen van de ronde tijd
let element_rounds_played;      // Tonen van de rondes gespeeld tot nu toe
let element_cells;              // De cellen in het speelbord, hierin tonen we de afbeelding van een speler
let element_game_button;        // De knop om een ronde te starten of te resetten

// HELPER VARIABLES
let current_player = 1;         // Het nummer van de speler die aan de beurt is  
let score_player1 = 0;          // Hier houden we de score van speler 1 bij
let score_player2 = 0;          // Hier houden we de score van speler 2 bij
let current_round = 0;          // Welke ronde is het
let timer_id;                   // ID van de interval, dit is de klok van een ronde
let elapsedTimeInSeconds;       // Verlopen ronde tijd in seconden

// CONSTANTEN
const _PLAYER1 = 1;             // Beter leesbaar in onze code dan het getal 1, is ook Index in _IMAGES
const _PLAYER2 = 2;             // Beter leesbaar in onze code dan het getal 2, is ook Index in _IMAGES

const _EMPTY_CELL = 0;          // Index van de array hieronder voor de afbeelding die een lege cel weergeeft

const _IMAGES = [
    'img/empty.jpg',            // Index 0, afbeelding lege Cel
    'img/cross200x200.png',     // Index 1, afbeelding/symbool van speler 1
    'img/circle200x200.png'     // Index 2, afbeelding/symbool van speler 2
];

// Leesbare constanten
const _CELL1 = 0;                // Indexwaarden voor de array met cellen
const _CELL2 = 1;                // Dit is ook leesbaarder in onze code dan
const _CELL3 = 2;                // gewoon getallen.
const _CELL4 = 3;
const _CELL5 = 4;
const _CELL6 = 5;
const _CELL7 = 6;
const _CELL8 = 7;
const _CELL9 = 8;

/*
 * Met deze methode vertellen we de browser dat de functie die hier
 * geprogrammeerd is gekoppeld moet worden aan de LOAD event.
 * Deze code wordt dan automatisch uitgevoerd wanneer de browser
 * klaar is met het verwerken en opslaan van de pagina in de DOM.
 */
window.onload = function() {
   /*
   * We gaan eerst alle elementen 'binnenhalen'
   */
   element_cells = document.querySelectorAll('.gameboard img');
   element_game_button = document.querySelector('#game-button');
   element_turn_number = document.querySelector('.turn-player');
   element_turn_image = document.querySelector('#img-turn-player');
   element_rounds_played = document.querySelector('.info-round p:last-child');
   element_score_player1 = document.querySelector('#score-player-one');
   element_score_player2 = document.querySelector('#score-player-two');
   element_round_time = document.querySelector('.round-timer');

   /*
   * We gaan nu de hulp variabelen initialiseren met een startwaarde
   * Voor b.v. scores geldt dat we de scores resetten naar 0,
   * we beginnen dus opnieuw te tellen.
   */
   timer_id = null;            // NULL, want er is nog geen lopende timer
   elapsedTimeInSeconds = 0;   // 0, want er is nog geen ronde gestart
   score_player1 = 0;          // 0, reset van de score
   score_player2 = 0;          // 0, reset van de score
   current_round = 0;          // 0, want er is nog geen ronde gestart

   // We gaan nu vertellen dat een click event op de button moet worden
   // opgevangen en de afhandeling van een click door de functie
   // buttonClick moet worden gedaan.
   element_game_button.addEventListener('click', buttonClick);
}


