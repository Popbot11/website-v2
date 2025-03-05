import itemData from './itemData.json' with {type: 'json'};
const numItems = itemData.length;

let canvas = document.getElementById("canvas");
let filters = []

function makeItem(item){
    // argument `item` is an object. a single field in the primary `itemData` object. 
    // ui is the main mode that we are appending everything to as we go, which we will then return. 
    var ui = document.createElement("div");

    // creates the text specifying the date of publication
    var date = document.createElement("span");
    date.innerText = Object.keys(item["dates"])[0] + " - "
    date.style.fontFamily = "Courier New"
    ui.appendChild(date);

    // creates the main link
    var primaryLink = document.createElement("a");
    primaryLink.innerText = item["title"];
    primaryLink.setAttribute("href", item["href"]);
    ui.appendChild(primaryLink);

    // creates the list of tags after the link
    var tags = document.createElement("span");
    var tagsText = " | ";
    for (const i in item["tags"]){
        tagsText += item["tags"][i] + " | "
    }
    tags.innerText = tagsText
    ui.appendChild(tags);

    return ui;
}

for (const i in itemData) {
    console.log(itemData[i]["title"]);
    let item = makeItem(itemData[i]);
    canvas.appendChild(item);
}

