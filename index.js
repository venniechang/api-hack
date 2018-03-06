const STORE = {
 data: null,
 multiplier: null
};

const currencyURL= "https://api.fixer.io/latest";
//google maps api key AIzaSyCikYUxmjYBHfC73yZgYi8HueHD8YmjqJ0
//https://api.fixer.io/latest?base= <---input baseCurrency

function getCurrencyData(baseCurrency, targetCurrencies, callback){
    const params = {
        base: baseCurrency,
        symbols: targetCurrencies //"GBP,AUD,CNY,CAD,CZK"
    }
$.getJSON(currencyURL, params, callback)

}
/*getCurrencyData("USD", function(data){
    storeCurrencyData(data);
    showCurrencyData(STORE.data);
})*/

function generateCurrencyCard(data, symbol) {
    const currentRoundedRate = data.rates[symbol].toFixed(2);
    return `<div class = "card">${symbol}: ${currentRoundedRate}</div>`;
}

function showCurrencyData(data) { // want to display results to DOM
    let output = "";
    console.log(data.rates);
    for (let symbol in data.rates) {
    output += generateCurrencyCard(data, symbol);
    }
    $(".display-results").html(output);
    
}

function storeCurrencyData(data) {
     STORE.data = data;
}

function convertCurrencyAmount(data, multiplier) { //multiply each number in rates and store it in data in place of starting rate
    for (let symbol in data.rates) {
        data.rates[symbol] = data.rates[symbol] * multiplier;
        console.log(symbol);
    }
    
    console.log(STORE.data);
    console.log(STORE.multiplier);
}

function handleFormSubmit() {
    $(".form").on("submit", function(event){
        event.preventDefault();
        const userAmount = $("#input-amount").val();
        const baseCurrency = $("#starting-currency").val();
        const targetCurrencies = $("input[name=symbols]:checked");
        getCurrencyData(baseCurrency, targetCurrencies, function(data){
            storeCurrencyData(data);
            convertCurrencyAmount(STORE.data, STORE.multiplier);
            showCurrencyData(STORE.data);
        
        })
    })
}

function handleAmountChange() {
    $(".form").on("input", "#input-amount", function(event){
        STORE.multiplier = $(event.currentTarget).val();
    })

}

function buildSymbolString(symbols){

    const symbolString = "";


}

//function roundCurrencyDigits(data){
  //  console.log(data.rates);
//}
handleAmountChange();
handleFormSubmit();
//roundCurrencyDigits();