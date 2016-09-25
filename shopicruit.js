//Jquery 3.1 must be included 

var products = [];
var goToNextPage = true;
var pageNumber = 1;
var nonTaxableTotal = 0.0;
var TaxableTotal = 0.0
var totalCost = 0.0
var QuebecSaleTax = 1.1475; //GST 5% + QST 9.975%


while(goToNextPage)
{
    $.ajax(
        {
            url: "https://shopicruit.myshopify.com/products.json?page="+pageNumber,
            dataType: "json",
            async : false
        }
    ).done(function(data) {
        products = products.concat(data.products);

        if(data.products == 0)
        {
            goToNextPage = false;
        }
    });
    pageNumber++;
}


function isClockOrWatch(product)
{
    return (product.product_type == "Clock" || product.product_type == "Watch")
}

var clocksAndWatches = products.filter(isClockOrWatch)

function addAvailableItem(variant)
{
  if(variant.available)
  {
      if(variant.taxable == true)
      {
          TaxableTotal += parseFloat(variant.price);
      }else{
         nonTaxableTotal += parseFloat(variant.price);
     }
  }
}

//calculate total of all available clocks and watches 
 clocksAndWatches.forEach(function(item)
 {
     item.variants.forEach(addAvailableItem)
 })

var taxedTotal = TaxableTotal * QuebecSaleTax;
totalCost = nonTaxableTotal + taxedTotal;

console.log("Before Tax total = "+ (TaxableTotal + nonTaxableTotal).toFixed(2)); // Before Tax total = 2290.74
console.log("nonTaxableTotal cost = "+ nonTaxableTotal.toFixed(2) + " $"); // nonTaxableTotal cost = 0.00 $
console.log("taxedTotal cost = "+ taxedTotal.toFixed(2) + " $"); // taxedTotal cost = 2628.62 $
console.log("Total cost = "+ totalCost.toFixed(2) + " $"); // Total cost = 2628.62 $
