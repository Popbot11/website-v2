import entryData from './entryData.json' with {type: 'json'};
import personData from './personData.json' with {type: 'json'};

entryData.sort((a, b) => parseInt(Object.keys(b.dates)[0].replaceAll("-","")) - parseInt(Object.keys(a.dates)[0].replaceAll("-",""))); 

const categories = ["music", "contraption"];


// track mouse position
var mouseX;
var mouseY;
document.addEventListener(
    "mousemove",
    (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
);

// generate html for a single entry
const renderEntry = entry => {
    var element = document.createElement("div");
    element.className="item";
    element.innerHTML = `<span class="year">${Object.keys(entry.dates)[0].substring(0, 4)}</span> | <span class="title">${entry.title}</span> <span class="tags">${entry.tags.join(", ")}</span>`
    
    // TODO: define more dynamic functionality for dates. on hover, the date should expand to a verbose date ("Month" ##, 20xx)
    var dropdown = document.createElement("div");
    dropdown.appendChild(renderDropdown(entry));

    if (Object.keys(entry).includes("contents")) {
        dropdown.appendChild(renderTracklist(entry));
    }

    dropdown.className="dropdown";

    element.addEventListener(
        "mouseover",
        (event) => {
            element.style.backgroundColor = "rgba(0, 0, 0, 0.27)";
            dropdown.style=`transform:translateX(${mouseX}px);`;
            element.appendChild(dropdown);
        }
    );
    element.addEventListener(
        "mouseout",
        (event) => {
            element.style.backgroundColor = "";
            element.removeChild(dropdown);
        }
    )

    element.addEventListener(
        "mousedown",
        (event) => {
            // display stuff in main window when clicked
            document.getElementById("content").innerHTML="";
            document.getElementById("content").appendChild(renderContent(entry));
        }
    )

    return element;
};

// generate html for the main info dropdown
const renderDropdown = (entry) => {
    
    var element = document.createElement("div");
    
    element.className="info";
    element.innerHTML = `
    <center style="font-size: 20px">${entry.title}<br></center>
    <div class="container">
        <span>Author(s):</span> 
        <div class="indent">
            ${Object.keys(entry.contributors).map(author => ` <span><b>${author}</b>: ${entry.contributors[author]}</span><br>`).join('')}
        </div>
    </div>
    <div class="container">
        <span>Date(s):</span>
        <div class="indent">
            ${Object.keys(entry.dates).map(date => `<span><b>${date}</b>: ${entry.dates[date]}</span><br>`).join('')}
        </div>
    </div>
    `;
    
    return element;
};

// generate HTML for the tracklist, if applicable
const renderTracklist = (entry) => {
    
    var element = document.createElement("div");
    element.className="tracklist";
    element.innerHTML=`
    <div class="container">
        <span>Tracklist: </span>
        <div class="indent">
            
            ${entry.contents.map((track, index) => `<div>${index + 1}. ${track}</div>`).join('')}
        </div>
    </div>
    `;
    return element;
};



// inject html for the content, displayed after an item is clicked
const renderContent = entry => {
    var element = document.createElement("div");
    element.innerHTML = `
    <div class="container">
        <span>Authors:</span>
        <div class="indent">
            ${Object.keys(entry.contributors).map(author => renderAuthor(author, entry).outerHTML).join("")}
            <br>
            <span id="authorInfo"></span>
        </div>
        <span>Dates:</span>
        <div class="indent">
        
        </div>
        <hr>
    </div>
    `;
    // renderDisplay();
    
    return element;
};


const renderAuthor = (author, entry) => {
    var element = document.createElement("button");
    element.innerHTML=`${author}`
    
    const renderAuthorLink = (text, author) => {return `<a href='${personData[author.toLowerCase()][String(text)]}' target='_blank'>${text}</a>`;}
    try {
        element.setAttribute("onclick", `document.getElementById("authorInfo").innerHTML="${author}: ${Object.keys(personData[author.toLowerCase()]).map(text => renderAuthorLink(text, author)).join(" | ")}<br>role: ${entry.contributors[author]}"`);
    } catch {
        element.setAttribute("onclick", `document.getElementById("authorInfo").innerHTML="${author.toLowerCase()} isn't in the database"`);
    }
    // element.setAttribute("onclick", `console.log("")`);

    return element;
}




// TODO: extra dropdowns for person data and verbose dates (full changelog)

// render full list of entries
for (const entry of entryData){
    for (const category of categories) {
        if (entry.categories.includes(category)) {
            document.getElementById("container-"+category).appendChild(renderEntry(entry));
        }
    }
}
