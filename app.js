// Alticator 2022
// Transport Designer

var bicyclesManufactured = 0;
var bicyclesInventory = 0;
var money = 10000;
var cost = {
    bicycle: 300
}
var marketingLevel = 1;
var marketingTimer = 0;
var saleInterval = 120;
var bicyclePrice = 600;
var marketingCost = 300;
var stage = 0;
var assemblyLines = 0;
var assemblyLineCost = 500;
var productionBuffer = 0;
var assemblyTimer = 0;
var assemblyInterval = "not in use";
var level1AssemblyInterval = 120;

function newBicycle() {
    if (money >= cost.bicycle){
        bicyclesManufactured++;
        bicyclesInventory++;
        money -= cost.bicycle;
        $("#bicycles-counter").html(bicyclesManufactured.toLocaleString("en"));
        $("#bicycles-inventory").html(bicyclesInventory.toLocaleString("en"));
        $("#money").html(money.toLocaleString("en"));
    }
}

// -------- Assembly Lines --------

function runAssemblyLines() {
    assemblyTimer++;
    if (assemblyTimer >= assemblyInterval && money >= 300) {
        bicyclesManufactured++;
        bicyclesInventory++;
        money -= 300;
        $("#bicycles-counter").html(bicyclesManufactured.toLocaleString("en"));
        $("#bicycles-inventory").html(bicyclesInventory.toLocaleString("en"));
        $("#money").html(money.toLocaleString("en"));
        assemblyTimer = 0;
    }
}

function newAssemblyLine() {
    assemblyLines++;
    assemblyLineCost *= 1.5;
    if (assemblyInterval == "not in use") {
        assemblyInterval = level1AssemblyInterval;
    }
    else {
        assemblyInterval /= 1.2;
    }
    $("#assembly-lines").html(assemblyLines.toLocaleString("en"));
    $("#assembly-line-cost").html(assemblyLineCost.toLocaleString("en"));
}

// -------- Sales & Marketing --------

function sales() {
    marketingTimer++;
    if (marketingTimer >= saleInterval && bicyclesInventory > 0) {
        bicyclesInventory--;
        money += bicyclePrice;
        $("#bicycles-inventory").html(bicyclesInventory.toLocaleString("en"));
        $("#money").html(money.toLocaleString("en"));
        marketingTimer = 0;
    }
}

function upgradeMarketing() {
    if (money >= marketingCost) {
        marketingLevel++;
        saleInterval = saleInterval / 1.3;
        money -= marketingCost;
        marketingCost = marketingCost * 1.8;
        $("#marketing-level").html(marketingLevel);
        $("#marketing-cost").html(marketingCost.toLocaleString("en"));
        $("#money").html(money.toLocaleString("en"));
    }
}

// -------- Milestones --------

function milestones() {
    if (stage < 1 && bicyclesManufactured >= 5) {
        stage++;
        $("#assembly-line-menu").show();
    }
}

// -------- Main Loop --------

function mainLoop() {
    sales();
    runAssemblyLines();
    milestones();
}

setInterval(mainLoop, 20);