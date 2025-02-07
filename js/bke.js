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
   timer_id = null;                 // NULL, want er is nog geen lopende timer
   elapsed_time_in_seconds = 0;     // 0, want er is nog geen ronde gestart
   score_player1 = 0;               // 0, reset van de score
   score_player2 = 0;               // 0, reset van de score
   current_round = 0;               // 0, want er is nog geen ronde gestart

   // We gaan nu vertellen dat een click event op de button moet worden
   // opgevangen en de afhandeling van een click door de functie
   // buttonClick moet worden gedaan.
   element_game_button.addEventListener('click', buttonClick);
}

/**
 * buttonClick
 * -----------
 * Dit is de eventhandler functie die gekoppeld is aan de 
 * game button, waarmee we een ronde kunnen starten of een
 * ronde kunnen resetten.
 * 
 * @param {Object} game_button       Het element waarop geklikt is, na destructering de button dus
 * 
 * @returns void
 */
function buttonClick({ target: game_button }) {
   /* 
      We controleren hier of de tekst op de button gelijk is aan: 'Start ronde'
      Want als dat zo is dan moet er namelijk iets anders gebeuren dan wanneer
      de tekst 'Reset ronde' op de button staat.
   */
   if(game_button.innerText == 'Start ronde') {
      // JA! Dus ondernemen we nu de stappen om een ronde te starten
      startRound();
   } else {
      // NEE! Dan staat er naar alle waarschijnlijkheid 'Reset ronde' op de knop
      stopRound();
   }
}

/**
 * cellClick
 * ---------
 * De eventhandler functie die het klikken op een cel
 * in het speelveld afhandeld. Dit betekent dat deze
 * functie wel moet achterhalen op welke van de 9 
 * cellen er geklikt is, daarvoor gebruiken we de
 * parameter event_element. Deze parameter wordt door
 * de browser automatisch gevuld met alle informatie
 * rondom de gebeurtenis (event) en het element waarop
 * geklikt is. In feite is deze functie de kern van ons
 * spel.
 * 
 * @param {Object} cell       Element (destructering van de property target), de naam verteld welk type element
 * 
 * @returns void              (geen return waarde)
 */
function cellClick({target: cell})
{
   if (isCellEmpty(cell)) {
      // Cell is leeg, het heeft nu pas zin om de onderstaande acties uit te voeren

      showPlayerSymbolInCell(cell);       // Toon spelersymbool in de cel
      removeCellEventListener(cell);      // Verwijder de klik eventhandler van deze cel

      switchPlayerTurn();                 // Wissel van beurt en toon dit in de UI
      
      /*
       * We controleren nu of een van de twee spelers heeft gewonnen.
       * We controleren eerst speler 1, daarna speler 2.
       * Heeft niemand gewonnen dan kan er nog sprake zijn van een gelijkspel
       * We controleren daarom aan het eind nog op een gelijkspel.
       * 
       * We controleren dit, omdat als er sprake is van deze situaties
       * de ronde kan worden gestopt namelijk.
       * In alle andere gevallen doet deze functies niks en kan het spelen van
       * de ronde gewoon doorgaan.
       */
      if (didPlayerWin(_PLAYER1)) {                         // Controle of _PLAYER1 heeft gewonnen
         // JA: Speler 1 heeft gewonnen
         score_player1 += 2;                                // Winnaar krijgt 2 punten
         element_score_player1.innerText = score_player1;   // We tonen de nieuwe score

         stopRound();                                       // We stoppen de ronde

      } else if (didPlayerWin(_PLAYER2)) {                  // Controle of _PLAYER2 heeft gewonnen
         // JA: Speler 2 heeft gewonnen, speler 1 dus niet
         score_player2 += 2;                                // Speler krijgt 2 punten
         element_score_player2.innerText = score_player2;   // We tonen de nieuwe score

         stopRound();                                       // We stoppen de ronde

      } else if (isDrawSituation()) {                       // Controle op GELIJKSPEL
         // JA: Geen enkele lege cell gevonden, dus gelijkspel. Dus beide spelers hebben niet gewonnen.
         score_player1++;                                   // Beide spelers krijgen 1 punt
         score_player2++;                                   // Beide spelers krijgen 1 punt
         element_score_player1.innerText = score_player1;   // Toon de nieuwe score van speler1
         element_score_player2.innerText = score_player2;   // Toon de nieuwe score van speler2

         stopRound();                                       // Stop de ronde
      }
   }
}

/**
 * roundsTimer
 * -----------
 * Dit is eveneens een eventhandler, alleen wordt deze
 * functie niet getriggered door een actie van een
 * speler, maar door een tijdlus (per seconde).
 * Deze functie houdt het aantal verlopen seconden per
 * ronde bij in een hulpvariabele (elapsed_time_in_seconds) 
 * en stelt een string samen om de verlopen tijd in minuten
 * en seconden die dan vervolgens in de UI wordt getoond.
 * 
 * @param   geen
 * 
 * @returns void
 */
function roundsTimer()
{
   /**
    * Onderstaande variabele is lokaal en wordt alleen
    * intern in de functie gebruikt om uit het totaal aantal
    * verlopen seconden het aantal verlopen minuten te berekenen
    * en vast te houden in het geheugen. We initialiseren deze
    * variabele altijd met de waarde 0 zodra deze functie
    * (dus iedere seconde) wordt uitgevoerd.
    */
   let elapsed_time_in_minutes = 0;

   /**
    * We verhogen de globale variabele, waarin we per ronde de verlopen
    * seconden bijhouden, met 1. Want er is immers weer een seconde verlopen
    * wanneer deze functie getriggered wordt.
    */ 
   elapsed_time_in_seconds++;

   /**
    * Hieronder berekenen we hoeveel minuten er in het totaal
    * aantal seconden per ronde zit en bewaren de uitkomt van 
    * deze berekening in de lokale variabele. Met de JavaScript
    * functie parseInt kappen we een eventueel kommagetal af tot
    * een heel getal, want voor het aantal minuten zijn we niet
    * geïnteresseerd in het getal achter de komma.
    */
   elapsed_time_in_minutes = parseInt(elapsed_time_in_seconds / 60);

   /**
    * Hieronder bouwen/creëren we een string om de verlopen tijd
    * per ronde in minuten en seconden juist weer te geven in de UI.
    * De format van de string is: mm:ss.
    */ 
   element_round_time.innerText =
      (elapsed_time_in_minutes < 10 ? '0' : '') +        // Een voorloop nul plaatsen indien nodig bij minuten
      elapsed_time_in_minutes.toString() +               // De werkelijk verlopen minuten aan de string plakken
      ':' +                                              // Een dubbele punt als scheiding tussen minuten en seconden aan de string vastplakken  
      (elapsed_time_in_seconds % 60 < 10 ? '0' : '') +   // Een voorloop nul aan de string vastplakken indien nodig
      (elapsed_time_in_seconds % 60).toString();         // De werkelijk resterende verlopen seconden aan de string vastplakken
}

/**
 * addAllCellEventListeners
 * ------------------------
 * Voegt een eventhandler toe aan iedere cell in het speelveld
 */
function addAllCellEventListeners()
{
   element_cells.forEach(cell => {
      cell.addEventListener('click', cellClick);
   });
}

/**
 * removeAllCellEventListeners
 * ---------------------------
 * Verwijdert alle eventhandlers van alle cellen in het speelveld
 */
function removeAllCellEventListeners()
{
   element_cells.forEach(cell => {
      cell.removeEventListener('click', cellClick);
   });
}

/**
 * removeCellEventListener
 * -----------------------
 * Verwijder de eventhandler van een specifieke cell (de cell die is meegegeven) in het speelveld.
 * 
 * @param {Object} cell                Object van een IMG-tag
 */
function removeCellEventListener(cell)
{
   // Alleen uitvoeren als de gegeven CELL een object is en de tagname ook daadwerkelijk IMG is
   if (typeof (cell) == "object" && cell.tagName == 'IMG') {
      cell.removeEventListener('click', cellClick);
   }
}

/**
 * emptyAllCells
 * -------------
 * Maak alle cellen weer leeg (plaats dus empty.jpg in elke cell) in het speelveld
 */
function emptyAllCells()
{
   element_cells.forEach(cell => cell.src = _IMAGES[_EMPTY_CELL]);
}

/**
 * startTimer
 * ----------
 * Start een ronde timer, maar we laten eerst een lopende timer stoppen
 * met behulp van de functie stopTimer.
 */
function startTimer()
{
   /*
    * We starten nu de ronde timer
    * Als echter de variabele timer_id niet gelijk is aan NULL dan loopt er nog 
    * een timer, deze moeten we eerst stoppen.
   */
   stopTimer();

   // We starten nu een nieuwe timer
   timer_id = setInterval( roundsTimer, 1000 );    // Om de seconde mag de functie roundsTimer uitgevoerd worden
}

/**
 * stopTimer
 * ---------
 * Stop een lopende timer (als deze loopt in elk geval).
 */
function stopTimer()
{
   if(timer_id != null) {           // Als de variabele timer_id niet NULL is is er al een timer
      clearInterval(timer_id);      // Stop de timer
      timer_id = null;              // Reset de variabele op NULL
      elapsed_time_in_seconds = 0;  // Reset de variabele op 0 seconden
   }
}

/**
 * increaseRound
 * -------------
 * Verhoog het ronde nummer en toont het nieuwe nummer
 */
function increaseRound()
{
   current_round++;                                      // Ronde nummer met 1 verhogen           
   element_rounds_played.innerHTML = current_round;      // Nu plaatsen we het nummer in het element
                                                         // om het te tonen aan de spelers
}

/**
 * determineStartingPlayer
 * -----------------------
 * Bepaald willekeurig welke speler mag beginnen en toont dit in de UI
 */
function determineStartingPlayer()
{
   // Willekeurig bepalen welke speler mag beginnen, dit levert een 1(speler 1) of een 2(speler 2) op
   current_player = Math.floor(Math.random() * 2 + 1);  

   showPlayerTurn();
}

/**
 * showPlayerSymbolInCell
 * ----------------------
 * Toon het symbool van de huidige speler in de gegeven cell.
 * 
 * @param {Object} cell 
 */
function showPlayerSymbolInCell(cell)
{
   cell.src = _IMAGES[current_player];             // Speler symbool laten zien
}

/**
 * showPlayerTurn
 * --------------
 * Toon het nummer en het symbool van de speler die aan de beurt is.
 */
function showPlayerTurn()
{
   // Nu gaan we tonen op het scherm welke speler de ronde mag beginnen
   element_turn_number.innerHTML = current_player;     // Het nummer tonen

   // Toon nu het symbool van de speler
   element_turn_image.src = _IMAGES[current_player];
}

/**
 * switchPlayerTurn
 * ----------------
 * Geef de beurt aan de volgende speler.
 */
function switchPlayerTurn()
{
   current_player = (current_player == _PLAYER1 ? _PLAYER2 : _PLAYER1); // Wisselen van beurt

   showPlayerTurn();
}

/**
 * startRound
 * ----------
 * Start een nieuwe ronde
 */
function startRound()
{
   increaseRound();

   determineStartingPlayer();

   addAllCellEventListeners();

   element_game_button.innerHTML = 'Reset ronde';     // Tekst op de knop veranderen

   // We resetten en tonen een ronde tijd 00:00
   element_round_time.innerHTML = '00:00';
   startTimer();
}

/**
 * stopRound
 * ---------
 * Stop de huidige ronde
 */
function stopRound()
{
   removeAllCellEventListeners();
   emptyAllCells();
   
   element_game_button.innerHTML = 'Start ronde';     // Tekst op de knop veranderen

   // Nu stoppen we de ronde timer
   stopTimer();
}

/**
 * didPlayerWinOn
 * --------------
 * Controleert of de aangegeven speler heeft gewonnen in de combinatie van 3 meegegeven cellen
 * Dit kan een rij, kolom of diagonaal zijn.
 * 
 * @param {Object} cell1      Eerste cell
 * @param {Object} cell2      Tweede cell
 * @param {Object} cell3      Derde cell
 * @param {Integer} player    Speler nummer
 * 
 * @returns {Boolean}         // TRUE: Als alle symbool afbeeldingen in de 3 meegegeven cellen van de speler zijn
 *                            // FALSE: Niet alle symbool afbeeldingen in de 3 meegegeven celle zijn van de speler
 */
function didPlayerWinOn(cell1, cell2, cell3, player)
{
   return (
      element_cells[cell1].src.includes(_IMAGES[player]) &&    // Eerste cel van Rij/Kolom/Diagonaal
      element_cells[cell2].src.includes(_IMAGES[player]) &&    // Tweede cel van Rij/Kolom/Diagonaal
      element_cells[cell3].src.includes(_IMAGES[player])       // Derde cel van Rij/Kolom/Diagonaal
   );
}

/**
 * didPlayerWin
 * ------------
 * Controleert of een gegeven speler heeft gewonnen in alle scenario's (Rij of Kolom of Diagonaal).
 * Geeft TRUE als de gegeven speler heeft gewonnen, anders FALSE
 * 
 * @param {Integer} player    Speler nummer
 * 
 * @returns {Boolean}         TRUE: Speler heeft gewonnen, FALSE: Speler heeft niet gewonnen
 */
function didPlayerWin(player)
{
   return (
      didPlayerWinOn(_CELL1, _CELL2, _CELL3, player) ||        // Rij 1
      didPlayerWinOn(_CELL4, _CELL5, _CELL6, player) ||        // Rij 2
      didPlayerWinOn(_CELL7, _CELL8, _CELL9, player) ||        // Rij 3

      didPlayerWinOn(_CELL1, _CELL4, _CELL7, player) ||        // Kolom 1
      didPlayerWinOn(_CELL2, _CELL5, _CELL8, player) ||        // Kolom 2
      didPlayerWinOn(_CELL3, _CELL6, _CELL9, player) ||        // Kolom 3

      didPlayerWinOn(_CELL1, _CELL5, _CELL9, player) ||        // Diagonaal 1
      didPlayerWinOn(_CELL3, _CELL5, _CELL7, player)           // Diagonaal 2
   );
}

/**
 * isCellEmpty
 * -----------
 * Controleert of een cel leeg is (oftewel de image empty.jpg bevat).
 * 
 * @param {Object} cell 
 * 
 * @returns {Boolean}      TRUE: Cel is leeg, FALSE: Cel is NIET leeg
 */
function isCellEmpty(cell)
{
   return (
      cell.src.includes(_IMAGES[_EMPTY_CELL])
   );
}

/**
 * isDraw
 * ---------------
 * Toch gekozen voor deze naam i.p.v. checkDraw, omdat deze naam meer een vraag suggereert waarop 
 * met JA (TRUE) of NEE (FALSE) kan worden geantwoord.
 * Controleert of er nog op z'n minst 1 lege cell in speelveld is. Zo ja, dan is er geen
 * sprake van een DRAW (Gelijkspel).
 * 
 * @returns {Boolean}      TRUE: Gelijkspel, geen lege cellen meer, FALSE: Er is nog een lege cel
 */
function isDraw()
{
   for (let cell of element_cells) {                  // Lus om langs alle cellen te lopen
      if (cell.src.includes(_IMAGES[_EMPTY_CELL]))
         return false;                                // We zijn een lege cel tegengekomen, dus nog geen gelijkspel
   }

   return true;                                       // Als we hier komen dan hebben we geen lege cel gevonden, dus een gelijkspel
}