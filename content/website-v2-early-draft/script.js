import entryData from './entryData.js';
import personData from './personData.js';


entryData.sort((a, b) => parseInt(Object.keys(b.dates)[0].replaceAll("-","")) - parseInt(Object.keys(a.dates)[0].replaceAll("-",""))); 

const categories = ["music", "contraption"];
var tags = {
    "shitpost": false,
    "wip": false
};

console.log(tags);




// track mouse position
let mouseX;
let mouseY;

document.addEventListener(
    "mousemove",
    (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        document.getElementById("mousecoords").innerHTML = `
                debug stuff:<br>
                X: ${mouseX}<br>
                Y: ${mouseY}<br>
                scroll: ${window.scrollY}<br>
                vp width: ${getViewportWidth()}`;
    }
);


// var viewportwidth;
// var viewportheight;
// if (typeof window.innerWidth != 'undefined') {
//      viewportwidth = window.innerWidth,
//      viewportheight = window.innerHeight
// } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
//     viewportwidth = document.documentElement.clientWidth,
//     viewportheight = document.documentElement.clientHeight
// } else {
//       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
//       viewportheight = document.getElementsByTagName('body')[0].clientHeight
// }

// code from https://andylangton.co.uk/web-development/get-viewport-size-width-and-height-with-javascript/
const getViewportWidth = () => {
    if (typeof window.innerWidth != 'undefined') {
        return window.innerWidth;
   } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
       return document.documentElement.clientWidth;
   } else {
         return document.getElementsByTagName('body')[0].clientWidth;
   }
}

// generate html for a single entry
const renderEntry = (entry) => {
    let element = document.createElement("div");
    element.className="item";
    element.id = (entry.title);
    element.innerHTML = `
        <span class="tags">${entry.tags.join(", ")}</span>
        <span class="year">${Object.keys(entry.dates)[0].substring(0, 4)}</span> | 
        <span class="title">${entry.title}</span> `
    
    // TODO: define more dynamic functionality for dates. on hover, the date should expand to a verbose date ("Month" ##, 20xx)
    let dropdown = document.createElement("div");
    dropdown.appendChild(renderDropdown(entry));

    if (Object.keys(entry).includes("contents")) {
        dropdown.appendChild(renderTracklist(entry));
    }

    dropdown.className="dropdown";

    element.addEventListener(
        "mouseover",
        (event) => {
            element.style.backgroundColor = "rgba(0, 0, 0, 0.27)";
            
            dropdown.style=`
                top: ${mouseY + 10 + window.scrollY + 2}px;
                left: ${Math.max(
                    Math.min(
                        mouseX + 10 + window.scrollX - 126.6, 
                        getViewportWidth() - 253.2), 
                    0)}px;
            `;
            document.documentElement.appendChild(dropdown);
            
        }
    );
    element.addEventListener(
        "mouseout",
        (event) => {
            element.style.backgroundColor = "";
            document.documentElement.removeChild(dropdown);
        }
    )

    element.addEventListener(
        "mousedown",
        (event) => {
            // display stuff in main window when clicked
            document.getElementById("metadata").innerHTML="";
            document.getElementById("metadata").appendChild(renderContent(entry));
        }
    )
    

    return element;
};

// generate html for the main info dropdown
const renderDropdown = (entry) => {
    
    let element = document.createElement("div");
    
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

    element.style=`transform: rotate(${(Math.random() * 10 )- 5}deg)`
    
    return element;
};

// generate HTML for the tracklist, if applicable
const renderTracklist = (entry) => {
    
    let element = document.createElement("div");
    element.className="tracklist";
    element.innerHTML=`
    <div class="container">
        <span>Tracklist: </span>
        <div class="indent">
            
            ${entry.contents.map((track, index) => `<div>${index + 1}. ${track}</div>`).join('')}
        </div>
    </div>
    `;
    element.style=`transform: rotate(${(Math.random() * 10 )- 5}deg)`
    return element;
};


// inject html for the content, displayed after an item is clicked
const renderContent = entry => {
    let element = document.createElement("div");
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
            dates dont work yet :)
        </div>
        
    `;

    // NOTE: prioritizes 
    if (Object.keys(entry).includes("src")){
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", entry.src);

        // TODO: finish this
        element.appendChild(iframe);
        document.getElementById("description").innerHTML = `no description provided`;
    } else if (Object.keys(entry).includes("description")) {
        document.getElementById("description").innerHTML = `<b>${entry.title}</b>:<br>${entry.description}`;
    }
    else {
        console.log("does not include source or description");
    }

    
    // renderDisplay();
    element.innerHTML += `</div>`
    return element;
};


const renderAuthor = (author, entry) => {
    let element = document.createElement("button");
    element.innerHTML=`${author}`
    
    const renderAuthorLink = (text, author) => {return `<a href='${personData[author.toLowerCase()][String(text)]}' target='_blank'>${text}</a>`;}
    try {
        element.setAttribute("onclick", `document.getElementById("authorInfo").innerHTML="<b>${author}</b>: ${Object.keys(personData[author.toLowerCase()]).map(text => renderAuthorLink(text, author)).join(" | ")}<br><b>role</b>: ${entry.contributors[author]}"`);
    } catch {
        element.setAttribute("onclick", `document.getElementById("authorInfo").innerHTML="<b>${author}</b>: isn't in the database yet; no links. <br><b>role</b>: ${entry.contributors[author]}"`);
    }
    return element;
}


function filterEntries(){
    for (const entry of entryData){
        let rendered = true;
        // console.log(entry.tags.sort());
        for (const entryTag of entry.tags.sort()){
            if (!tags[entryTag.toLowerCase()]) { 
                rendered = false; 
            }  
        }

        if (!rendered){
            document.getElementById(entry.title).setAttribute("hidden", "hidden")
        } else {
            document.getElementById(entry.title).removeAttribute("hidden")
        }

    }
}

// GO ENTRIES
for (const entry of entryData){
    for (const tag of entry.tags.sort()) {
        if (!(tag.toLowerCase() in tags)) {
            tags[tag.toLowerCase()] = true;
        }
    }

    for (const category of categories) {
        if (entry.categories.includes(category)) {
            document.getElementById("container-"+category).appendChild(renderEntry(entry));
        }
        
    }
}


// GO TAGS
console.log(tags);
for (const tag of Object.keys(tags)) {
    let checkbox = document.createElement("span");
    const checkboxStatus = input => {
        if(!input){ return "checked"; } 
        return "";
    }
    checkbox.innerHTML = `
        <input type="checkbox" id="${tag}"  ${checkboxStatus(tags[tag.toLowerCase()])}>
        <label for="${tag}">${tag}</label>
        <br>
    `

    checkbox.addEventListener("change", () => {
        tags[tag] = !tags[tag];
        filterEntries();
    })

    document.getElementById("container-taglist").appendChild(checkbox);
}

filterEntries();




// TODO: ZORA CODE IMPLEMENT THIS IN A SEC
// const renderAuthorLink = (text, author) => `<a href='${personData[author.toLowerCase()][String(text)]}' target='_blank'>${text}</a>`;
// element.addEventListener("click", () => {
//   const links = Object.keys(personData[author.toLowerCase()]).map(text => renderAuthorLink(text, author)).join(" | ");
//   document.getElementById("authorInfo").innerHTML = links;
// });
