// Alticator 2022
// Transport Designer

// -------- Declarations --------

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

// -------- Bicycle Manufacturing --------

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
    if (money >= assemblyLineCost) {
        money -= assemblyLineCost;
        assemblyLines++;
        assemblyLineCost *= 1.3;
        if (assemblyInterval == "not in use") {
            assemblyInterval = level1AssemblyInterval;
        }
        else {
            assemblyInterval /= 1.2;
        }
    }
    $("#money").html(money);
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
    if (stage < 2 && bicyclesManufactured >= 100) {
        stage++;
        $("#development-menu").show();
        newDevelopment("ebike", "E-Bikes", "Add electric motors to your bicycles to make them go faster. Increases production price by 50 and sale price by 150.", 30000, "startEBikes()");
    }
}

// -------- Messages --------

function newMessage(content) {
    $("#messages").prepend(`<div class="list-group-item border-info">${content}</div>`);
}

// -------- Developments --------

function newDevelopment(id, title, description, cost, onclick) {
    var item = `<button onclick="${onclick}" id="development-${id}" class="list-group-item">
        <h5 class="pt-2">${title}</h5>
        <p>${description}</p>
        <p><b>Cost: </b>${cost.toLocaleString("en")}</p>
        </button>`
    
    $("#development-list").prepend(item);
}

function removeDevelopment(id) {
    $("#development-" + id).remove();
}

// -------- E-Bikes --------

function startEBikes() {
    if (money >= 30000) {
        removeDevelopment("ebike")
        money -= 30000;
        cost.bicycle += 50;
        bicyclePrice += 150;
        newMessage(`<h5>Production of E-Bikes Started!</h5><p>Sale price now ${bicyclePrice} and production cost ${cost.bicycle}`);
    }
}

// -------- Main Loop --------

function mainLoop() {
    sales();
    runAssemblyLines();
    milestones();
}

setInterval(mainLoop, 20);