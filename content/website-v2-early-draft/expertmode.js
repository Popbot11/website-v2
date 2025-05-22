import entryData from './entryData.js';
import personData from './personData.js';


entryData.sort((a, b) => parseInt(Object.keys(b.dates)[0].replaceAll("-","")) - parseInt(Object.keys(a.dates)[0].replaceAll("-",""))); 

// generate html for a single entry
const renderEntry = (entry) => {
    let element = document.createElement("div");
    element.className="item";
    element.id = (entry.title);
    element.innerHTML = `
        <b class="larger">${entry.title}</b><br><br>
        <span>Authors:</span>
        <div class="indent">
            ${Object.keys(entry.contributors).map(author => renderAuthor(author, entry).outerHTML).join("")}
            <br>
            <span id="authorInfo${entry.title}"></span>
        </div><br><br>
        <b>description:</b><br>
        <span class="indent">${(entry.description)}</span><br><br>
        
        `

    if (Object.keys(entry).includes("contents")) {
        element.appendChild(renderTracklist(entry));
    }
    
    element.innerHTML+="<hr>";
    return element;
};


// generate HTML for the tracklist, if applicable
const renderTracklist = (entry) => {
    
    let element = document.createElement("div");
    
    element.innerHTML=`
    <div class="container">
        <span><b>Tracklist: </b></span>
        <div class="indent">
            
            ${entry.contents.map((track, index) => `<div>${index + 1}. ${track}</div>`).join('')}
        </div>
    </div>
    `;
    return element;
};

const renderAuthor = (author, entry) => {
    let element = document.createElement("button");
    element.innerHTML=`${author}`
    
    const renderAuthorLink = (text, author) => {return `<a href='${personData[author.toLowerCase()][String(text)]}' target='_blank'>${text}</a>`;}
    try {
        element.setAttribute("onclick", `document.getElementById("authorInfo${entry.title}").innerHTML="<b>${author}</b>: ${Object.keys(personData[author.toLowerCase()]).map(text => renderAuthorLink(text, author)).join(" | ")}<br><b>role</b>: ${entry.contributors[author]}"`);
    } catch {
        element.setAttribute("onclick", `document.getElementById("authorInfo${entry.title}").innerHTML="<b>${author}</b>: isn't in the database yet; no links. <br><b>role</b>: ${entry.contributors[author]}"`);
    }
    return element;
}

// GO ENTRIES
for (const entry of entryData){
    document.getElementById("container").appendChild(renderEntry(entry));
}

