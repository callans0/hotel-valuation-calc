document.addEventListener('DOMContentLoaded', function(event){

    //********** GLOBAL VARIABLES **************//
    const $capRate = document.getElementById('capRate');
    const $annualProfit = document.getElementById('annualProfit');
    const $currentValue = document.getElementById('currentValue');
    const $currValueInputs = document.getElementsByClassName('current');
    const $currencyInput = document.getElementsByClassName('currencyInput'); //use to format currency fields

    const $barTurnover = document.getElementById('barTurnover'); //object
    const $foodTurnover = document.getElementById('foodTurnover'); //object
    const $gamingTurnover = document.getElementById('gamingTurnover'); //object
    const $otherTurnover = document.getElementById('otherTurnover'); //object
    const $profitIncrease = document.getElementById('profitIncrease'); //object
    const $futureValue = document.getElementById('futureValue'); //object
    const $futureValueInputs = document.getElementsByClassName('futureValueInput'); //object

    const barFactor = '0.45';
    const foodFactor = '0.20';
    const gamingFactor = '0.60';
    const otherFactor = '0.20';

    barTurnoverValue = 0;
    foodTurnover = 0;
    gamingTurnoverValue = 0;
    otherTurnoverValue = 0;


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
        if ( !$capRate.value ) {
            var capRate = 0;
        } else {
            var capRate = parseInt($capRate.value) 
        }
        var annProf = $annualProfit.value;
        console.log(annProf, typeof annProf);
        // If any of the inputs are falsy return empty string, else return current value (to 2 dp)
        if ( (typeof capRate == 'undefined' || !capRate || capRate == '0') || (typeof annProf == 'undefined' || !annProf || annProf == '0') ) {
            document.getElementsByClassName('result-unit')[0].style.color = "#494B92";
            return "";
        } else {
            const currValue = (parseInt($annualProfit.value.replace(/,/g, ''))) / ($capRate.value / 100);
            document.getElementsByClassName('result-unit')[0].style.color = "#FF6201";
            return delimitNumbers(currValue.toFixed(0));
        }
    };


    // PROFIT INCREASE
    function calculateProfitIncrease() {
        if ( !$barTurnover.value && !$foodTurnover.value && !$gamingTurnover.value && !otherTurnover.value ) {
            document.getElementsByClassName('result-unit')[1].style.color = "#494B92";
            return "";
        } else {
            if ( !$barTurnover.value ) {
            var barTurnoverValue = 0;
            } else {
            var barTurnoverValue = parseInt($barTurnover.value.replace(/,/g, ''));
            }

            if ( !$foodTurnover.value ) {
                var foodTurnoverValue = 0;
            } else {
                var foodTurnoverValue = parseInt($foodTurnover.value.replace(/,/g, ''));
            }

            if ( !$gamingTurnover.value ) {
                var gamingTurnoverValue = 0;
            } else {
                var gamingTurnoverValue = parseInt($gamingTurnover.value.replace(/,/g, ''));
            }

            if ( !$otherTurnover.value ) {
                var otherTurnoverValue = 0;
            } else {
                var otherTurnoverValue = parseInt($otherTurnover.value.replace(/,/g, ''));
            }
            const profitIncrease = (barTurnoverValue * barFactor) + (foodTurnoverValue * foodFactor) + (gamingTurnoverValue * gamingFactor) + (otherTurnoverValue * otherFactor);
            console.log(profitIncrease, typeof profitIncrease);
            return delimitNumbers(profitIncrease.toFixed(0));
        }
    }



    //FUTURE MARKET VALUE
    function calculateFutureValue() {
        if ( (typeof $currentValue.value == 'undefined' || !$currentValue.value || $currentValue.value == '0') ) {
            document.getElementsByClassName('result-unit')[1].style.color = "#494B92";
            return "";
        } else {
            let capRate = parseInt($capRate.value);
            let annProf2 = parseInt($annualProfit.value.replace(/,/g, ''));
            const barTurnoverValue = parseInt($barTurnover.value.replace(/,/g, ''));
            const foodTurnoverValue = parseInt($foodTurnover.value.replace(/,/g, ''));
            const gamingTurnoverValue = parseInt($gamingTurnover.value.replace(/,/g, ''));
            const otherTurnoverValue = parseInt($otherTurnover.value.replace(/,/g, ''));

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

            if (!otherTurnoverValue) {
                var otherProfit = 0;
            } else {
                var otherProfit = otherTurnoverValue * otherFactor;
            }

            const futureValue = (annProf2 + barProfit + foodProfit + gamingProfit + otherProfit) / ($capRate.value / 100);
    
            if ( !isNaN(futureValue) || futureValue == 'undefined' ) {
                document.getElementsByClassName('result-unit')[2].style.color = "#FF6201";
                return delimitNumbers(futureValue.toFixed(0));
            } else {
                document.getElementsByClassName('result-unit')[2].style.color = "#494B92";
                return "";
            }
        }
    };


    /////////////// EVENT LISTENERS //////////////

    // Listens for input on the cap rate and annual profit fields and calculates CURRENT market value  
    for ( i = 0; i < $currValueInputs.length; i++ ) {
        $currValueInputs[i].addEventListener( "keyup", () => {
            $currentValue.value = calculateCurrentValue();
            $futureValue.value = calculateFutureValue();
        });
    };

    // Listens for input on the increase profit fields and calculates PROFIT INCREASE + FUTURE market value
    for ( i = 0; i < $futureValueInputs.length; i++ ) {
        $futureValueInputs[i].addEventListener( "keyup", () => {
            $futureValue.value = calculateFutureValue();
            $profitIncrease.value = calculateProfitIncrease();
        });
    };


    // RESET BUTTONS
    // const $resetCurrent = document.getElementById('resetButtonCurrent');
    // const $resetFuture = document.getElementById('resetButtonFuture');

    const $resetButtons = document.querySelectorAll('button');
    for ( i = 0; i < $resetButtons.length; i++ ) {
        console.log($currValueInputs);
        $resetButtons[i].addEventListener( "click", () => {
            event.preventDefault();
            for ( i = 0; i < $currValueInputs.length; i++ ) {
                $currValueInputs[i].value = '';
                calculateCurrentValue();
                calculateFutureValue();
            }
        });
    };



}); // end