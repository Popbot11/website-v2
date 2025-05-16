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
    "collection",
    "shitpost",
    "wip",
    "m4l",
    "paid"
];

// useful for clearing event listeners
function recreateNode(el, withChildren) {
  if (withChildren) {
    el.parentNode.replaceChild(el.cloneNode(true), el);
  }
  else {
    let newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }
}

// DEBUG STUFF

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
    () => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        viewportWidth = window.innerWidth;
        updateDebug();
        updateMobileNotif();
    }
);
window.addEventListener(
    "resize",
    () => {
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
document.getElementById("log-selected-item").addEventListener(
    "click",
    () => {
        console.log("selected item: "+selectedItems)
    }
)


// OPTIONS MENU

document.getElementById("options-button").addEventListener(
    "click",
    () => {
        let optionsMenu = document.getElementById("options-menu");
        if (optionsMenu.style.visibility == "visible") {
            optionsMenu.style.visibility = "hidden";
        } else {
            optionsMenu.style.visibility = "visible";
        }
    }
);
function filterShitposts() {
    if (document.getElementById("include-shitposts").checked) {
        document.querySelectorAll('[id^="entry-"]').forEach(entry => {
            
            if ((entry.getAttribute("data-tags")+'').split(",").includes('shitpost')) {
                entry.removeAttribute("hidden");
            } 
        })
    } else {
        document.querySelectorAll('.entry').forEach(entry => {
            if ((entry.getAttribute("data-tags")+'').split(",").includes('shitpost')) {
                // console.log(entry.id)
                entry.setAttribute("hidden", "hidden");
            } 
        })
    }
}
document.getElementById("include-shitposts").addEventListener(
    "click",
    () => {
        filterShitposts();
    }
);

let selectedItems = new Set();

fetch("content/index.json").then(res => res.json()).then(index => {
    // this goes through and creates all of the nessisary item divs in the correct order
    // this has to be done first because all their contents will be loaded asynchronously
    const fetchPromises = [];
    
    console.log(index);
    Object.keys(index).forEach(async title => {
        const path = title.toLowerCase().replaceAll(" ", "-");
        
        

        

        let entryDropdown = document.createElement("div")
        entryDropdown.className = "dropdown";
        entryDropdown.innerHTML = `
            <span id="dropdown-${title}-title"></span>
            <span id="dropdown-${title}-dates"></span>
            <span id="dropdown-${title}-contributors"></span>
            <span id="dropdown-${title}-description"></span>
        `;
        document.getElementById("dropdown-cache").appendChild(entryDropdown);

        let expertModeButton = document.createElement("span");
        expertModeButton.className = "expert-mode";
        expertModeButton.id = `item-${title}-expert-mode`;
        expertModeButton.innerHTML = `<a>expert mode</a>`


        let entryItem = document.createElement("div");
        entryItem.className="entry";
        entryItem.id = ("entry-"+title);
        entryItem.innerHTML = `       
            <span class="tags" id="item-${title}-tags"></span>
            <span class="year" id="item-${title}-date">${index[title]["date"].substring(0,4)}</span> | 
            <span class="title">${title}</span> 
            <br>
        `;
        entryItem.appendChild(expertModeButton)
        entryItem.innerHTML += `<span class="links" id="item-${title}-links"></span>`;



        // ON MOUSEOVER
        entryItem.addEventListener(
            "mouseover",
            () => {
                entryItem.style.left = "10px";
                entryItem.style.backgroundColor = "rgba(1, 1, 1, 0.1)";
                const allTags = entryItem.querySelectorAll('[class^="tag-"]');
                allTags.forEach(el => {
                    if (el.className == "tag-hidden") {
                        el.style =  "visibility: visible";
                    }
                    el.style.backgroundColor = "rgb(0, 255, 255)";
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

        // ON MOUSEOUT
        entryItem.addEventListener(
            "mouseout",
            () => {
                entryItem.style.left = "";
                entryItem.style.backgroundColor = "rgba(1, 1, 1, 0)";
                
                const allTags = entryItem.querySelectorAll('[class^="tag-"]');
                allTags.forEach(el => {
                    el.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    if (el.className == "tag-hidden") {
                        // console.log(el)
                        el.style.visibility = "hidden";
                        el.style.position = "absolute";
                    }
                });

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
                
                // Don't process click if it's on a link
                if (event.target.tagName === 'A') return;
                
                // MANAGE SELECTED
                if (selectedItems.has(title)) {
                    document.getElementById(`entry-${title}`).classList.remove("selected");
                    selectedItems.delete(title);
                } else {
                    document.getElementById(`entry-${title}`).classList += " selected";
                    selectedItems.add(title);
                }

                // EXPERT MODE BUTTON
                document.getElementById(`item-${title}-expert-mode`).addEventListener(
                    "click",
                    () => {
                        console.log(`${title}: expert mode`);
                        let url = new URL("content/index.html", window.location.href);
                        url.searchParams.append('entry', path);
                        window.open(url.toString(), "viewMedia", "width=600,height=620,menubar=no,toolbar=no");
                    }
                )
                
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

                            // LINKS (depreciate this)
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
                                    () => {
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
                                    () => {
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
                                        () => {
                                            
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
                                        () => {
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
                                            let url = new URL("viewMedia.html", window.location.href);
                                            url.searchParams.append('path', path)
                                            window.open(url.toString(), "viewMedia", "width=600,height=620,menubar=no,toolbar=no");
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
        fetchPromises.push(
            fetch('./content/'+path+"/data.json")
                .then(res => res.json())
                .then(data => {
                    // TAGS
                    {
                        document.getElementById(`item-${title}-tags`).innerHTML = data.tags.map(tag => {
                            if (priorityTags.includes(tag)) {
                                return `<span class="tag-priority" id="tag-${title}-${tag}" style="visibility: visible;">${tag}</span>`
                            } else {
                                return `<span class="tag-hidden" id="tag-${title}-${tag}" style="visibility: hidden; position: absolute;">${tag}</span>`
                            }
                            
                        }).join("");

                        document.getElementById(`entry-${title}`).setAttribute("data-tags", data.tags.join(","));                        
                            
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
                            () => {
                                document.getElementById(`item-${title}-date`).innerHTML = Object.keys(data["dates"])[0];
                            }
                        )
                        document.getElementById(`item-${title}-date`).addEventListener(
                            "mouseleave",
                            () => {
                                document.getElementById(`item-${title}-date`).innerHTML = Object.keys(data["dates"])[0].substring(0,4);
                            }
                        )
                    }

                    // LINKS
                    {
                        document.getElementById(`item-${title}-links`).innerHTML = ``+
                            `<b>||</b> ${Object.keys(data["links"])
                                .map(link => {
                                    let url = data["links"][link];
                                    if (url.startsWith("../content/")) {
                                        url = url.substring(1);
                                    } 
                                    if (url.startsWith("../content/") || url.startsWith("./content/")) {
                                        return `<b><a href="${url}">${link}</a></b>`;                
                                    }
                                    return `<a href="${url}" target="_blank">${link}</a>`;
                                }).join(" | ")}
                            `;
                        ;

                    }


                })
                .catch(error => console.error(`Error loading data for ${title}:`, error))
        );
        
    });

    // wait for all fetches to complete
    return Promise.all(fetchPromises);
}).then(() => {
    console.log("All entries loaded");
    filterShitposts();
}).catch(error => {
    console.error("Error loading entries:", error);
})
