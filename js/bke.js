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
let elapsed_time_in_seconds;       // Verlopen ronde tijd in seconden

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

function buttonClick(event_element) {
   /* 
      We controleren hier of de tekst op de button gelijk is aan: 'Start ronde'
      Want als dat zo is dan moet er namelijk iets anders gebeuren dan wanneer
      de tekst 'Reset ronde' op de button staat.
   */
   if(event_element.target.innerHTML == 'Start ronde') {

      current_round++;                                        // Ronde nummer met 1 verhogen           
      element_rounds_played.innerHTML = current_round;        // Nu plaatsen we het nummer in het element
                                                               // om het te tonen aan de spelers

      // Willekeurig bepalen welke speler mag beginnen, dit levert een 1(speler 1) of een 2(speler 2) op
      current_player = Math.floor(Math.random() * (2 - 1 + 1) + 1);  
   
      // Nu gaan we tonen op het scherm welke speler de ronde mag beginnen
      element_turn_number.innerHTML = current_player;     // Het nummer tonen
      element_turn_image.src = (current_player == _PLAYER1 ? _IMAGES[_PLAYER1] : _IMAGES[_PLAYER2]);
      
      /*
         In de onderstaande programma lus lopen we nu langs alle cellen in het speelbord
         en koppelen hier een click eventhandler aan.
      */
      element_cells.forEach(cell => {
         cell.addEventListener('click', cellClick);
      });

      event_element.target.innerHTML = 'Reset ronde';     // Tekst op de knop veranderen
      element_round_time.innerHTML = '00:00';             // We resetten en tonen een ronde tijd 00:00
      
      /*
      * We starten nu de ronde timer
      * Als echter de variabele timer_id niet gelijk is aan NULL dan loopt er nog 
      * een timer, deze moeten we eerst stoppen.
      */
      if(timer_id != null) {          // Als de variabele timer_id niet NULL is is er al een timer
         clearInterval(timer_id);    // Stop de timer
         timer_id = null;            // Reset de variabele op NULL
         elapsed_time_in_seconds = 0;   // Reset de variabele op 0 seconden
      }

      timer_id = setInterval( roundsTimer, 1000 );    // Om de seconde mag de functie roundsTimer uitgevoerd worden
   } else {
      /*  Nee, dan gaan we het spel resetten door de volgende
       *  stappen uit te voeren:
       *      - Timer stoppen
       *      - Laatste timer info tonen op het scherm
       *      - Speelveld leeg maken (overal weer empty.jpg in plaatsen) en
       *        Deactiveren van de click event handlers op de cellen
       *      - Start spel op de button plaatsen
      */
      
      /*  
       *  We gaan nu eerst alle cellen in het speelveld onklikbaar maken
      */
      element_cells.forEach(cell => {
         cell.removeEventListener('click', cellClick);
         cell.src = _IMAGES[_EMPTY_CELL];
      });
      
      event_element.target.innerHTML = 'Start ronde';     // Tekst op de knop veranderen

      // Nu stoppen we de ronde timer
      if(timer_id != null) {          // Als de variabele timer_id niet NULL is is er al een timer
         clearInterval(timer_id);    // Stop de timer
         timer_id = null;            // Reset de variabele op NULL
         elapsed_time_in_seconds = 0;   // Reset de variabele op 0 seconden
      }
   }
}
