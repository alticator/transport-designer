// Alticator 2022
// Transport Designer

// -------- Declarations --------

var bicyclesManufactured = 0;
var bicyclesInventory = 0;
var money = 10000;
var cost = {
    bicycle: 300,
    car: 12000,
}
var marketingLevel = 1;
var marketingTimer = 0;
var saleInterval = 120;
var bicyclePrice = 600;
var carPrice = 20000;
var marketingCost = 300;
var stage = 0;
var assemblyLines = 0;
var assemblyLineCost = 500;
var productionBuffer = 0;
var assemblyTimer = 0;
var assemblyInterval = "not in use";
var level1AssemblyInterval = 120;
var carFactories = 0;
var carFactoryCost = 30000;
var carAssemblyInterval = "not in use"
var level1CarAssemblyInterval = 480;
var carAssemblyTimer = 0;
var carsManufactured = 0;
var carsInventory = 0;
var carsInUse = false;

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
    if (stage <= 0 && bicyclesManufactured >= 5) {
        stage++;
        $("#assembly-line-menu").show();
    }
    if (stage <= 1 && bicyclesManufactured >= 100) {
        stage++;
        $("#development-menu").show();
        newDevelopment("ebike", "E-Bikes", "Add electric motors to your bicycles to make them go faster. Increases production price by 50 and sale price by 150.", 30000, "startEBikes()");
    }
    if (stage <= 2 && bicyclesManufactured >= 400) {
        stage++;
        newDevelopment("cars", "Cars", "Start making cars alongside bikes.", 40000, "startCars()")
    }
}

// -------- Messages --------

function newMessage(content) {
    $("#messages").prepend(`<div class="list-group-item border-info">${content}</div>`);
}

// -------- Developments --------

function newDevelopment(id, title, description, cost, onclick) {
    var item = `<div id="development-${id}" class="list-group-item">
        <h5 class="pt-2">${title}</h5>
        <p>${description}</p>
        <button onclick="${onclick}" class="btn btn-primary"><b>Buy for </b>${cost.toLocaleString("en")}</button>
        </div>`
    
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

// -------- Cars --------

function startCars() {
    if (money >= 40000) {
        removeDevelopment("cars");
        carsInUse = true;
        newMessage(`<h5>Production of Cars Started!</h5><p>Cars cost ${cost.car} but they sell for ${carPrice}`);
        $("#manufactured-list").append(`<br>Cars: <span id="cars-counter">0</span>`);
        $("#inventory-list").append(`<br>Cars: <span id="card-inventory">0</span>`);
        $("#manufacturing-menu").append('<br><button onclick="newCarFactory()" class="btn btn-primary">Car Factory</button><span id="car-factories">0</span><br>Cost: <span id="car-factory-cost">30000</span>');
    }
}

function newCarFactory() {
    if (money >= carFactoryCost) {
        money -= carFactoryCost;
        carFactories++;
        carFactoryCost *= 1.3;
        if (carAssemblyInterval == "not in use") {
            carAssemblyInterval = level1AssemblyInterval;
        }
        else {
            carAssemblyInterval /= 1.1;
        }
    }
    $("#money").html(money);
    $("#car-factories").html(carFactories.toLocaleString("en"));
    $("#car-factory-cost").html(carFactoryCost.toLocaleString("en"));
}

function runCarFactories() {
    if (carsInUse) {
        carAssemblyTimer++;
        if (carAssemblyTimer >= carAssemblyInterval && money >= cost.car) {
            carsManufactured++;
            carsInventory++;
            money -= cost.car;
            $("#cars-counter").html(bicyclesManufactured.toLocaleString("en"));
            $("#cars-inventory").html(bicyclesInventory.toLocaleString("en"));
            $("#money").html(money.toLocaleString("en"));
            carAssemblyTimer = 0;
        }
    }
}

// -------- Main Loop --------

function mainLoop() {
    sales();
    runAssemblyLines();
    runCarFactories();
    milestones();
}

setInterval(mainLoop, 20);