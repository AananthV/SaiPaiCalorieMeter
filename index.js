class foodItem {
  constructor(id, name, calories, fat, carbs, protien) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    this.fat = fat;
    this.carbs = carbs;
    this.protien = protien;
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getCalories() {
    return this.calories;
  }
  getCaloriePercent() {
    return ((this.calories/DailyCalorieCount)*100).toFixed(2);
  }
  getFat() {
    return this.fat;
  }
  getFatPercent() {
    return (((this.fat*9)/(DailyCalorieCount*0.30))*100).toFixed(2);
  }
  getCarbs() {
    return this.carbs;
  }
  getCarbPercent() {
    return (((this.carbs*4)/(DailyCalorieCount*0.45))*100).toFixed(2);
  }
  getProtien() {
    return this.protien;
  }
  getProtienPercent() {
    return (((this.protien*4)/(DailyCalorieCount*0.25))*100).toFixed(2);
  }
}

let Items = []
let Ids = [] //Array of all itemids;
let DailyCalorieCount = 2000;
let CalorieCount = 0;

let calPopup = function() {
  let popup = document.querySelector('#cal-popup');
  popup.classList.toggle('show')
};

let expandCard = function(card_id) {
  let card = document.querySelector("#"+card_id);
  let card_body = card.querySelector(".card-body")
  card_body.classList.toggle('show')
}

let addItem = function() {
  let currentTime = new Date();
  let itemId = currentTime.getTime();
  let name = document.querySelector('#item-name').value;
  let calories = parseInt(document.querySelector('#item-cal').value);
  let fat = parseInt(document.querySelector('#item-fat').value);
  let carbs = parseInt(document.querySelector('#item-carbs').value);
  let protien = parseInt(document.querySelector('#item-protien').value);
  if(calories < 0 || fat < 0 || carbs < 0 || protien < 0 || calories == "" || fat == "" || carbs == "" || protien == "" || name == ""){
    alert("Enter Proper, Positive Values!")
  } else {
    let item = new foodItem(itemId, name, calories, fat, carbs, protien);
    Items.push(item);
    Ids.push(itemId);
    insertCard(item);
    saveItem(item);
    document.querySelector('#item-name').value = "";
    document.querySelector('#item-cal').value = "";
    document.querySelector('#item-fat').value = "";
    document.querySelector('#item-carbs').value = "";
    document.querySelector('#item-protien').value = "";
  }
}

let createCard = function(item) {
  let card = document.createElement("div");
  card.className = "card"
  card.id = "card"+item.getId();
  card.onclick = function() {expandCard(this.id);};

  let cardTitle = document.createElement("div");
  cardTitle.className = "card-title";

  let cardHeading = document.createElement("span");
  cardHeading.className = "card-heading";
  cardHeading.innerHTML = item.getName();
  cardTitle.appendChild(cardHeading);

  let cardTitleBody = document.createElement("span");
  cardTitleBody.className = "card-text";
  cardTitleBody.innerHTML = item.getCalories()+" Calories";
  cardTitle.appendChild(cardTitleBody);

  let removeButton = document.createElement("button");
  removeButton.className = "btn rmbtn";
  removeButton.innerHTML = "Remove";
  removeButton.id = "rmbtn"+item.getId();
  removeButton.onclick = function(e) {
      removeItemById(parseInt(this.id.slice(5)));
      e.stopPropagation();
  }
  cardTitle.appendChild(removeButton);

  card.appendChild(cardTitle);

  cardBody = document.createElement("div");
  cardBody.className = "card-body";

  itemTable = document.createElement("table");
  itemTable.className = "item-details";

  //Create Table as Array first
  table = [
    ["<strong>Item</strong>", "<strong>Quantity</strong>", "<strong>% Of Daily Consumption</strong>"],
    ["Calories", item.getCalories(), item.getCaloriePercent()],
    ["Carbs", item.getCarbs(), item.getCarbPercent()],
    ["Fat", item.getFat(), item.getFatPercent()],
    ["Protien", item.getProtien(), item.getProtienPercent()]
  ];

  //Contert 2D Array to table use for-loops
  for(let row = 0; row < 5; row++) {
    let hrow = itemTable.insertRow(row);
    for(let cell = 0; cell < 3; cell++) {
      hrow.insertCell(cell).innerHTML = table[row][cell];
    }
  }

  cardBody.appendChild(itemTable);
  card.appendChild(cardBody);

  return card;
};

let insertCard = function(item) {
  let card = createCard(item);
  let cardList = document.querySelector("#card-list");
  cardList.appendChild(card);
  updateMeter();
  if(Items.length == 1){
    let dontBeHungry = document.querySelector("#dont-be-hungry");
    dontBeHungry.classList.toggle("dbh");
  }
};

let removeItemById = function(id) {
  //Delete from Items array
  Items = Items.filter(item => item.getId() != id);
  Ids = Ids.filter(id_ => id_ != id)

  //Delete from website
  let cardList = document.querySelector("#card-list");
  let cardById = document.querySelector("#card"+id);
  cardList.removeChild(cardById);
  updateMeter();
  if(Items.length == 0) {
    let dontBeHungry = document.querySelector("#dont-be-hungry");
    dontBeHungry.classList.toggle("dbh");
  }

  //Delete from localStorage
  localStorage.removeItem(id);
  saveItemIds();
};

let updateMeter = function() {
  //Insert items and Update Calorie Count
  CalorieCount = 0;
  for(let item = 0; item < Items.length; item++) {
    CalorieCount += Items[item].getCalories()
  }

  //Change Meter According to Calorie Count
  let calBar = document.querySelector("#cal-bar");
  calBar.innerHTML = CalorieCount+" Kcal";
  barWidth = (CalorieCount/DailyCalorieCount)*(2/3)*100;
  calBar.style.width = (barWidth<=100 ? barWidth : 100) + "%";
  if(CalorieCount <= DailyCalorieCount) {
    calBar.style.backgroundColor = "green";
  } else {
    calBar.style.backgroundColor = "red";
    alert("You're eating a bit too much");
  }
};

let updateSite = function() {
  //Empty Current Card list
  let itemList = document.querySelector("#item-list");
  let cardList = document.querySelector("#card-list");
  cardList.innerHTML = "";

  //Add Dont Be Hungry Message
  let dontBeHungry = document.createElement("p");
  dontBeHungry.id = "dont-be-hungry";
  dontBeHungry.className = "dont-be-hungry dbh";
  dontBeHungry.innerHTML = "Add some items, dont stay hungry :)";
  cardList.appendChild(dontBeHungry);

  //Insert Cards
  for(let item = 0; item < Items.length; item++) {
    insertCard(Items[item]);
  }

  //Update DCC
  document.querySelector("#cal-limit").value = DailyCalorieCount;

  //Dont-Be-Hungry Message
  toggleHungryMessage();

  updateMeter();
};

let toggleHungryMessage = function() {
  let dontBeHungry = document.querySelector("#dont-be-hungry");
  if(Items.length <= 0){
    dontBeHungry.classList.add("dbh");
  } else {
    dontBeHungry.classList.remove("dbh");
  }
};

let saveItemIds = function() {
  localStorage.setItem("ids", JSON.stringify(Ids))
};

let saveItem = function(item) {
  localStorage.setItem(item.getId(), JSON.stringify(item));
  saveItemIds();
};

let retrieveItem = function(id) {
  let item = JSON.parse(localStorage.getItem(id));
  let classitem = new foodItem(item.id, item.name, item.calories, item.fat, item.carbs, item.protien);
  return classitem;
};

let saveDCC = function() {
  localStorage.setItem("dcc", DailyCalorieCount); //Save the daily calorie count
};

let saveAllItems = function() {
  for(item of Items) {
      saveItem(item);
  }
  saveDCC();
};

let retrieveAllItems = function() {
  //Get the ids first
  let ids = JSON.parse(localStorage.getItem("ids"));
  if(ids != null){
    for(id of ids) {
        Items.push(retrieveItem(id));
        Ids.push(id);
    }
  }
  DailyCalorieCount = localStorage.getItem("dcc") || 3000;
};

let resetAllItems = function() {
  for(id of Ids) {
    removeItemById(id);
  }
  toggleHungryMessage();
}

window.onload = function() {
  retrieveAllItems();
  updateSite();
};

let calcDailyCalories = function() {
  let isMale = document.querySelector("#calc-gen-m").checked;
  let age = parseInt(document.querySelector("#calc-age").value);
  let height = parseInt(document.querySelector("#calc-height").value);
  let weight = parseInt(document.querySelector("#calc-weight").value);
  let physically_active = parseFloat(document.querySelector("#calc-active").value);

  if(age == "" || height == "" || weight == "" || age < 0 || height < 0 || weight < 0) {
    alert("Enter Proper, Positive Values");
  } else {
    //Using the Harris-Benedict Equation
    let BMR = 0;
    if(isMale) {
      BMR = 66 + 13.7*weight + 5*height - 6.8*age;
    } else {
      BMR = 655 + 9.6*weight + 1.8*height - 4.7*age;
    }
    DailyCalorieCount = Math.round(BMR*physically_active);
  }
  document.querySelector("#cal-limit").value = DailyCalorieCount;
  saveDCC();
  calPopup();
  updateSite();
}
