// Logic for spacing out containers
// the purpose of the container class is to dynamically render out boxes so that when the window resizes, they move around
// implement this later if you want. for now, leave it as just being static. 

const getViewportWidth = () => {
    if (typeof window.innerWidth != 'undefined') {
        return window.innerWidth;
   } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
       return document.documentElement.clientWidth;
   } else {
         return document.getElementsByTagName('body')[0].clientWidth;
   }
}

const priorityTags = [
    "album",
    "ep",
    "shitpost",
    "wip",
    "m4l",
    "paid"
]

// useful for clearing event listeners
function recreateNode(el, withChildren) {
  if (withChildren) {
    el.parentNode.replaceChild(el.cloneNode(true), el);
  }
  else {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }
}


// track mouse position
let mouseX;
let mouseY;
let viewportWidth = window.innerWidth;

function updateDebug() {
    document.getElementById("mousecoords").innerHTML = `
                debug stuff:
                X: ${mouseX} |
                Y: ${mouseY} |
                scroll: ${window.scrollY} | 
                vp width: ${viewportWidth}`;
}

function updateMobileNotif() {
    if (viewportWidth < 970) {
            document.getElementById("mobileNotif").style = `
                visibility: visible;
                position: relative;
            `; 
        } else {
            document.getElementById("mobileNotif").style = `
                visibility: hidden;
                position: absolute;
            `; 
        }
}

document.addEventListener(
    "mousemove",
    (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        viewportWidth = window.innerWidth;
        updateDebug();
        updateMobileNotif();
    }
);
window.addEventListener(
    "resize",
    event => {
        viewportWidth = window.innerWidth;
        updateDebug();
        updateMobileNotif();
        
    }
)

if (viewportWidth < 970) {
    document.getElementById("mobileNotif").style = `
        visibility: visible;
        position: relative;
    `; 
}

fetch("content/index.json").then(res => res.json()).then(index => {
    // this goes through and creates all of the nessisary item divs in the correct order
    // this has to be done first because all their contents will be loaded asynchronously
    console.log(index);
    Object.keys(index).forEach(async title => {
        const path = title.toLowerCase().replaceAll(" ", "-")
        let entryItem = document.createElement("div");
        entryItem.className="entry";
        entryItem.id = ("entryItem-"+title);

        let entryDropdown = document.createElement("div")
        entryDropdown.className = "dropdown";
        entryDropdown.innerHTML = `
            <span id="dropdown-${title}-title"></span>
            <span id="dropdown-${title}-tags"></span>
            <span id="dropdown-${title}-dates"></span>
            <span id="dropdown-${title}-contributors"></span>
        `;
        document.getElementById("dropdown-cache").appendChild(entryDropdown);



        entryItem.innerHTML = `       
            <span class="year" id="item-${title}-date">${index[title]["date"].substring(0,4)}</span> | 
            <span class="title">${title}</span> 
            <span class="tags" id="item-${title}-tags"></span>
            <br>
        `;

        entryItem.addEventListener(
            "mouseover",
            (event) => {
                entryItem.style.left = "10px";
                entryItem.style.backgroundColor = "rgba(1, 1, 1, 0.1)";
                const hiddenTags = entryItem.querySelectorAll('.tag-hidden');
                hiddenTags.forEach(el => {
                    el.style = "visibility: visible;";
                });
            
                if (document.getElementById("show-dropdowns").checked) {
                    entryDropdown.style=`
                        top: ${mouseY + 25 + window.scrollY + 2}px;
                        left: ${Math.max(
                            Math.min(
                                mouseX + 10 + window.scrollX - 126.6, 
                                getViewportWidth() - 253.2), 
                            0)}px;
                        visibility: visible;
                    `;
                }
            }
        );
        entryItem.addEventListener(
            "mouseout",
            (event) => {
                entryItem.style.left = "";
                entryItem.style.backgroundColor = "rgba(1, 1, 1, 0)";
                entryItem.querySelectorAll('.tag-hidden').forEach(el => 
                    el.style = "visibility: hidden; position: absolute;");
                if (document.getElementById("show-dropdowns").checked) {
                    entryDropdown.style = `
                        visibility: hidden;
                    `;
                }
                
            }
        );

        // ONCLICK
        entryItem.addEventListener(
            "click",
            async (event) => {
                console.log("clicked "+title);
                
                
                // DESCRIPTION.TXT
                {
                    try {
                        const response = await fetch('./content/'+path+"/description.txt");
                        if (response.ok) {
                            const file = await response.text();
                            if (file.length != 0) {
                                document.getElementById(`container-description`).innerHTML = `
                                    <b>Description</b>:
                                    <div class="indent">${file}</div>
                                `;
                            } else {
                                document.getElementById(`container-description`).innerHTML = `
                                    <b>Description</b>:<br> <span class="error">description is empty</span>
                                `;
                            }
                        } else {
                            document.getElementById(`${title}-description`).remove();
                        }
                    } catch (error) {}
                }

                // DATA.JSON
                {
                    try {
                        const response = await fetch('./content/'+path+"/data.json");
                        if (response.ok) {
                            const data = await response.json();
                            
                            // TITLE
                            document.getElementById(`container-title`).innerHTML = title;
                            
                            // CATEGORY
                            document.getElementById(`container-category`).innerHTML = data.categories[0];

                            // TAGS
                            document.getElementById(`container-tags`).innerHTML = data.tags.map(tag => `${tag}`).join(" | ");
                            

                            // CONTRIBUTORS
                            {
                                // let element = document.createElement("span");
                                let target = document.getElementById(`container-contributors`)
                                target.innerHTML = `
                                    <b>Contributors</b>: 
                                    <span id='contributor-buttons'></span><br><br>
                                    <span id='contributor-links'></span>`;
                                Object.keys(data.contributors).forEach(contributor => {
                                    
                                    let button = document.createElement("button");
                                    button.innerHTML = contributor
                                    button.setAttribute("onclick", "fetch('./data/personData.json').then(res => res.json()).then(personData => {try{document.getElementById('contributor-links').innerHTML = `<b>"+contributor+":</b> "+data.contributors[contributor]+"<br><b>Links:</b> ${Object.keys(personData['"+contributor.toLowerCase()+"']).map(text => \"<a target='_blank' href='\"+personData['"+contributor.toLowerCase()+"'][text]+\"'>\"+text+\"</a>\").join(' | ')}` + `<br><button onclick=\"document.getElementById('contributor-links').innerHTML=null;\">hide</button>`;}catch{document.getElementById('contributor-links').innerHTML = `<b>"+contributor+"</b>: "+data.contributors[contributor]+"<br><b>Links:</b>  isn't in the database yet; no links` + `<br><button onclick=\"document.getElementById('contributor-links').innerHTML=null;\">hide</button>`;}})");
                                    document.getElementById('contributor-buttons').appendChild(button);
                                });
                            }

                            // LINKS
                            {  
                                document.getElementById(`container-links`).innerHTML = `
                                <b>Links</b>: ${Object.keys(data.links)
                                    .map(link => {
                                        let url = data.links[link];
                                        if (url.startsWith("../content/")) {
                                            url = url.substring(1);
                                        } 
                                        return `<a href="${url}" target="_blank">${link}</a>`;
                                    }).join(" | ")}
                                `;
                            }

                            // DATES
                            {
                                document.getElementById("date-dropdown").innerHTML =  Object.keys(data["dates"]).map(date => 
                                    `<b>${date}</b>: ${data["dates"][date]}`
                                ).join("<br>");

                                recreateNode(document.getElementById("container-date"));
                                const containerDate = document.getElementById(`container-date`);
                                containerDate.innerHTML = Object.keys(data["dates"])[0];
                                containerDate.addEventListener(
                                    "mouseover",
                                    event => {
                                       document.getElementById(`date-dropdown`).style=`
                                                top: ${mouseY + 25 + window.scrollY + 2}px;
                                                left: ${Math.max(
                                                    Math.min(
                                                        mouseX + 10 + window.scrollX - (document.getElementById("date-dropdown").offsetWidth / 2), 
                                                        getViewportWidth() - 253.2), 
                                                    0)}px;
                                                visibility: visible;
                                            `;
                                    }
                                );
                                containerDate.addEventListener(
                                    "mouseleave",
                                    event => {
                                        document.getElementById(`date-dropdown`).style.visibility = "hidden";
                                    }
                                );
                            }

                            // CONTENTS
                            {
                                if (Object.keys(data).includes("contents")){
                                    document.getElementById("container-contents").style.visibility = "visible";
                                    
                                    document.getElementById("contents-dropdown").innerHTML = data["contents"].map((track, index) => `<div>${index + 1}. ${track}</div>`).join('')

                                    recreateNode(document.getElementById("container-contents"));
                                    const containerContents = document.getElementById(`container-contents`);
                                    // containerDate.innerHTML = Object.keys(data["contents"])[0];
                                    containerContents.addEventListener(
                                        "mouseover",
                                        event => {
                                            
                                            document.getElementById(`contents-dropdown`).style=`
                                                top: ${mouseY + 25 + window.scrollY + 2}px;
                                                left: ${Math.max(
                                                    Math.min(
                                                        mouseX + 10 + window.scrollX - (document.getElementById("contents-dropdown").offsetWidth / 2), 
                                                        getViewportWidth() - 253.2), 
                                                    0)}px;
                                                visibility: visible;
                                            `;
                                        }
                                    );
                                    containerContents.addEventListener(
                                        "mouseleave",
                                        event => {
                                            document.getElementById(`contents-dropdown`).style.visibility = "hidden";
                                        }
                                    );
                                } else {
                                    document.getElementById("container-contents").style.visibility = "hidden";
                                }
                            }

                            //MEDIA
                            {
                                recreateNode(document.getElementById("container-media"));
                                let viewMediaButton = document.getElementById("container-media");
                                if (Object.keys(data).includes('media')) {
                                    viewMediaButton.style.visibility = "visible";
                                    viewMediaButton.addEventListener(
                                        "click",
                                        () => {
                                            alert("this feature doesn't work yet. \nit does work in expert mode, though. ")
                                        }
                                    );
                                } else {
                                    viewMediaButton.style.visibility = "hidden";
                                }
                            }

                        } else {
                            document.getElementById(`${title}-dates`).innerHTML = "<span class='error'>data file missing, or some other worse error</span><br>";
                        }
                    } catch (error) {}
                }
            }
        );
        

        document.getElementById("container-"+index[title]["category"]).appendChild(entryItem)
        
        // DATA.JSON
        {
            try {
                const response = await fetch('./content/'+path+"/data.json");
                if (response.ok) {
                    const data = await response.json();
                    
                    // TAGS
                    {
                        document.getElementById(`dropdown-${title}-tags`).innerHTML = `
                            <b>Tags</b>:
                            ${data.tags.map(tag => `${tag}`).join(" | ")}
                            <br>
                        `;
                        document.getElementById(`item-${title}-tags`).innerHTML = data.tags.map(tag => {
                            if (priorityTags.includes(tag)) {
                                return `<span class="tag-priority" id="tag-${title}-${tag}" style="visibility: visible;">${tag}</span>`
                            } else {
                                return `<span class="tag-hidden" id="tag-${title}-${tag}" style="visibility: hidden; position: absolute;">${tag}</span>`
                            }
                            
                        }).join("");
                            
                    }

                    // CONTRIBUTORS
                    {
                        // let element = document.createElement("span");
                         document.getElementById(`dropdown-${title}-contributors`).innerHTML = `
                            <b>Contributors</b>:<br>
                        `;

                        Object.keys(data.contributors).forEach(contributor => {
                            document.getElementById(`dropdown-${title}-contributors`).innerHTML+= `
                                <b><span class="indent">${contributor}</span></b>: ${data.contributors[contributor]}<br>
                            `;
                        });
                        
                    }

                   
                    // DATES
                    {
                        document.getElementById(`dropdown-${title}-dates`).innerHTML += "<b>Date(s)</b>:<br>"
                        for (const date of Object.keys(data["dates"])) {
                            document.getElementById(`dropdown-${title}-dates`).innerHTML += `
                                <span class="indent">${date}: ${data["dates"][date]}</span><br>
                            `
                        }

                        document.getElementById(`item-${title}-date`).addEventListener(
                            "mouseover",
                            (event) => {
                                document.getElementById(`item-${title}-date`).innerHTML = Object.keys(data["dates"])[0];
                            }
                        )
                        document.getElementById(`item-${title}-date`).addEventListener(
                            "mouseleave",
                            (event) => {
                                document.getElementById(`item-${title}-date`).innerHTML = Object.keys(data["dates"])[0].substring(0,4);
                            }
                        )
                    }

                    // CONTENTS (unused code)
                    {
                        if (Object.keys(data).includes("contents")){
                            document.getElementById(`${title}-contents`).innerHTML += `
                                <b>Tracklist</b>:
                                <ol>
                                    ${data.contents.map((track) => `<li>${track}</li>`).join(``)}
                                </ol>
                            `;
                        } else {
                            document.getElementById(`${title}-contents`).remove();
                        }
                    }

                    // LINKS (unused code)
                    {
                        if (Object.keys(data).includes("links")) {
                            document.getElementById(`${title}-links`).innerHTML += `
                            <b>Links</b>: ${Object.keys(data.links).map(link => `<a href="${data.links[link]}" target="_blank">${link}</a>`).join(" | ")}
                            `;
                        } else {
                            document.getElementById(`${title}-links`).remove();
                        }
                    }

                    
                } else {
                    document.getElementById(`${title}-dates`).innerHTML = "<span class='error'>data file missing, or some other worse error</span><br>";
                }
            } catch (error) {}
        }
    
    });
})