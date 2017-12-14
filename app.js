document.addEventListener('DOMContentLoaded', function(event){

    //********** GLOBAL VARIABLES **************//
    const $capRate = document.getElementById('capRate');
    const $annualProfit = document.getElementById('annualProfit');
    const $currentValue = document.getElementById('currentValue');
    const $currValueInputs = document.getElementsByClassName('input');
    const $currencyInput = document.getElementsByClassName('currencyInput');
    const $barTurnover = document.getElementById('barTurnover');
    const $foodTurnover = document.getElementById('foodTurnover');
    const $gamingTurnover = document.getElementById('gamingTurnover');
    const $futureValue = document.getElementById('futureValue');
    const $futureValueInputs = document.getElementsByClassName('futureValueInput');
    const $allInputs = document.getElementsByClassName('input');
    const resetButton = document.getElementById('resetButton');

    const barFactor = '0.45';
    const foodFactor = '0.20';
    const gamingFactor = '0.60';


    //********** GLOBAL FUNCTIONS **************//
    // Formats a string with commas
    function delimitNumbers(str) {
        return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
            return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
        });
    };


    //********** FORMATTING **************//
    // CURRENCY FIELDS: stripping out special characters and delimiting with commas
    for ( i = 0; i < $currencyInput.length; i++ ) {
        $currencyInput[i].addEventListener( "keyup", function( event ) {
            var selection = window.getSelection().toString();
            // Prevents action when selection is made within the input or arrow keys are pressed
            if ( selection !== '' ) {
                return;
            }
            if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
                return;
            }
    
            var $this = $( this );
            var input = $this.val();
            var input = input.replace(/[\D\s\._\-]+/g, "");
            input = input ? parseInt( input, 10 ) : 0;
    
            $this.val( function() {
                return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
            });
        });
    };

    // CAP RATE
    // Removes special chars from cap rate
    $("#capRate").keyup(function() {
        $("#capRate").val(this.value.match(/[0-9]*/));
    });

    // If > 100 is entered, capRate is changed to 100
    $("#capRate").focusout(function() {
        const value = parseInt($capRate.value);
        if ( value > '100') {
            value = 100;
            input.value = value;
        }
    });

    //********** CALCULATIONS **************//
    // CURRENT MARKET VALUE
    function calculateCurrentValue(){
        let capRate = parseInt($capRate.value);
        let annProf = $annualProfit.value;
        // If any of the inputs are falsy return empty string, else return current value (to 2 dp)
        if ( (typeof capRate == 'undefined' || !capRate || capRate == '0') || (typeof annProf == 'undefined' || !annProf || annProf == '0') ) {
              return "";
        } else {
            const currValue = (parseInt($annualProfit.value.replace(/,/g, ''))) / ($capRate.value / 100);
            return delimitNumbers(currValue.toFixed(0));
        }
    };

    // Listens for input on the cap rate and annual profit fields and calculates / recalculates market value  
    for ( i = 0; i < $currValueInputs.length; i++ ) {
        $currValueInputs[i].addEventListener( "keyup", () => {
            $currentValue.value = calculateCurrentValue();
            $futureValue.value = calculateFutureValue();
        });
    };

    //FUTURE MARKET VALUE
    function calculateFutureValue() {
        if ( (typeof $currentValue.value == 'undefined' || !$currentValue.value || $currentValue.value == '0') ) {
            return "";
        } else {
            let capRate = parseInt($capRate.value);
            let annProf2 = parseInt($annualProfit.value.replace(/,/g, ''));
            const barTurnoverValue = parseInt($barTurnover.value.replace(/,/g, ''));
            const foodTurnoverValue = parseInt($foodTurnover.value.replace(/,/g, ''));
            const gamingTurnoverValue = parseInt($gamingTurnover.value.replace(/,/g, ''));

            if (!barTurnoverValue) {
                var barProfit = 0;
            } else {
                var barProfit = barTurnoverValue * barFactor;
            }

            if (!foodTurnoverValue) {
                var foodProfit = 0;
            } else {
                var foodProfit = foodTurnoverValue * foodFactor;
            }

            if (!gamingTurnoverValue) {
                var gamingProfit = 0;
            } else {
                var gamingProfit = gamingTurnoverValue * gamingFactor;
            }

            const newAnnualProfit = (annProf2 + barProfit + foodProfit + gamingProfit) / ($capRate.value / 100);
      
            if ( !isNaN(newAnnualProfit) || newAnnualProfit == 'undefined' ) {
                return delimitNumbers(newAnnualProfit.toFixed(0));
            } else {
                return "";
            }
        }
    };

    for ( i = 0; i < $futureValueInputs.length; i++ ) {
        $futureValueInputs[i].addEventListener( "keyup", () => {
            $futureValue.value = calculateFutureValue();
        });
    };

    // RESET BUTTON
    $('#resetButton').on( 'click', () => {
        for ( i = 0; i < $allInputs.length; i++ ) {
            $allInputs[i].value = '';
        }
    });

}); // end