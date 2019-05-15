class foodItem {
  constructor(name, calories, fat, carbs, protien) {
    this.name = name;
    this.calories = calories;
    this.fat = fat;
    this.carbs = carbs;
    this.protien = protien;
  }
  getName() {
    return this.name;
  }
  getCalories() {
    return this.calories;
  }
  getCaloriePercent() {
    return (this.calories/DailyCalorieCount)*100;
  }
  getFat() {
    return this.fat;
  }
  getFatPercent() {
    return ((this.fat*9)/(DailyCalorieCount*0.30))*100;
  }
  getCarbs() {
    return this.carbs;
  }
  getCarbPercent() {
    return ((this.carbs*4)/(DailyCalorieCount*0.45))*100;
  }
  getProtien() {
    return this.protien;
  }
  getProtienPercent() {
    return ((this.protien*4)/(DailyCalorieCount*0.25))*100;
  }
}

let Items = []
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
  let name = document.querySelector('#item-name').value;
  let calories = parseInt(document.querySelector('#item-cal').value);
  let fat = parseInt(document.querySelector('#item-fat').value);
  let carbs = parseInt(document.querySelector('#item-carbs').value);
  let protien = parseInt(document.querySelector('#item-protien').value);
  if(calories < 0 || fat < 0 || carbs < 0 || protien < 0 || calories == "" || fat == "" || carbs == "" || protien == "" || name == ""){
    alert("Enter Proper, Positive Values!")
  } else {
    Items.push(new foodItem(name, calories, fat, carbs, protien))
    document.querySelector('#item-name').value = "";
    document.querySelector('#item-cal').value = "";
    document.querySelector('#item-fat').value = "";
    document.querySelector('#item-carbs').value = "";
    document.querySelector('#item-protien').value = "";
  }
  updateSite()
}

let createCard = function(item, id) {
  let card = document.createElement("div");
  card.className = "card"
  card.id = "card"+id;
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
  removeButton.id = "rmbtn"+id;
  removeButton.onclick = function() {
    removeCard(parseInt(this.id.slice(5)));
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
    ["Carbohydrate", item.getCarbs(), item.getCarbPercent()],
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

let insertCard = function(item, id) {
  let card = createCard(item, id);
  let itemList = document.querySelector("#card-list");
  itemList.appendChild(card);
}

let removeCard = function(id) {
  Items = Items.slice(0, id).concat(Items.slice(id+1));
  updateSite();
}

let updateSite = function() {
  //Empty Current Card list
  let itemList = document.querySelector("#item-list");
  let cardList = document.querySelector("#card-list");
  itemList.removeChild(cardList);

  //Create New Card List
  cardList = document.createElement("div");
  cardList.id = "card-list";
  itemList.appendChild(cardList);

  //Insert items and Update Calorie Count
  CalorieCount = 0;
  for(let item = 0; item < Items.length; item++) {
    insertCard(Items[item], item);
    CalorieCount += Items[item].getCalories()
  }

  //Change Meter According to Calorie Count
  let calBar = document.querySelector("#cal-bar");
  console.log(CalorieCount);
  calBar.style.width = (CalorieCount/DailyCalorieCount)*(2/3)*100 + "%";
  if(CalorieCount <= DailyCalorieCount) {
    calBar.style.backgroundColor = "green";
  } else {
    calBar.style.backgroundColor = "red";
    alert("You're eating a bit too much");
  }
}

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
  calPopup();
}
