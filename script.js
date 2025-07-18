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
    "paid",
    "unfinished"
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

let rapidlisteners = 0;

function updateDebug() {
    document.getElementById("mousecoords").innerHTML = `
                X: ${mouseX} |
                Y: ${mouseY} |
                s: ${window.scrollY} | 
                vp: ${viewportWidth}`;
}

document.addEventListener(
    "mousemove",
    () => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        viewportWidth = window.innerWidth;
        updateDebug();
    }
);
rapidlisteners++;
window.addEventListener(
    "resize",
    () => {
        viewportWidth = window.innerWidth;
        updateDebug();
        
    }
);rapidlisteners++;

document.getElementById("log-selected-item").addEventListener(
    "click",
    () => {
        selectedItems.forEach(item => console.log(item));
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

            }
        );rapidlisteners ++;

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
            }
        );rapidlisteners ++;

        // ONCLICK
        entryItem.addEventListener(
            "click",
            async (event) => {
                console.log("clicked "+title);
                
                // Don't process click if it's on a link
                if (event.target.tagName === 'A') return;
                
                // MANAGE SELECTED
                if (document.getElementById("multi-select").checked) {
                    if (selectedItems.has(title)) {
                        document.getElementById(`entry-${title}`).classList.remove("selected");
                        selectedItems.delete(title);
                    } else {
                        document.getElementById(`entry-${title}`).classList += " selected";
                        selectedItems.add(title);
                    }
                } else {
                    if (selectedItems.has(title)) {
                        
                        document.getElementById(`entry-${title}`).classList.remove("selected");
                        selectedItems.delete(title);
                    } else {
                        selectedItems.forEach(selectedItem => {
                            document.getElementById(`entry-${selectedItem}`).classList.remove("selected");
                            selectedItems.delete(selectedItem)
                        });
                        document.getElementById(`entry-${title}`).classList += " selected";
                        selectedItems.add(title);
                    }
                }

                // EXPERT MODE BUTTON
                document.getElementById(`item-${title}-expert-mode`).addEventListener(
                    "click",
                    () => {
                        console.log(`${title}: expert mode`);
                        let url = new URL("content/index.html", window.location.href);
                        url.searchParams.append('entry', title);

                        const screenX = window.screenX || window.screenLeft;
                        const screenY = window.screenY || window.screenTop;
                        window.open(url.toString(), "viewMedia", `width=600,height=620,left=${screenX+700},top=${screenY+50},menubar=no,toolbar=no`);
                    }
                )
                
                // DESCRIPTION.TXT
                {
                    try {
                        const response = await fetch('./content/'+path+"/description.txt");
                        if (response.ok) {
                            const file = await response.text();
                            if (file.length != 0) {
                                document.getElementById(`info-description`).innerHTML = file;
                            } else {
                                document.getElementById(`info-description`).innerHTML = `
                                    <b>Description</b>:<br> <span class="error">description is empty</span>
                                `;
                            }
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
                            document.getElementById(`info-title`).innerHTML = `${title} -- `;

                            // TAGS
                            document.getElementById(`info-tags`).innerHTML = data.tags.map(tag => `${tag}`).join(" | ") + " -- ";
                            

                            // CONTRIBUTORS
                            {
                                // let element = document.createElement("span");
                                let target = document.getElementById(`info-contributors`)
                                target.innerHTML = `
                                    <b>Contributors</b>: 
                                    <span id='contributor-buttons'></span><br>
                                    <div id='contributor-links'></div>`;
                                Object.keys(data.contributors).forEach(contributor => {
                                    let button = document.createElement("button");
                                    button.innerHTML = contributor;
                                    button.setAttribute("onclick", "fetch('./data/personData.json').then(res => res.json()).then(personData => {try{document.getElementById('contributor-links').innerHTML = `<b>"+contributor+":</b> "+data.contributors[contributor]+"<br><b>Links:</b> ${Object.keys(personData['"+contributor.toLowerCase()+"']).map(text => \"<a target='_blank' href='\"+personData['"+contributor.toLowerCase()+"'][text]+\"'>\"+text+\"</a>\").join(' | ')}` + `<br><button onclick=\"document.getElementById('contributor-links').innerHTML=null;\">hide</button>`;}catch{document.getElementById('contributor-links').innerHTML = `<b>"+contributor+"</b>: "+data.contributors[contributor]+"<br><b>Links:</b>  isn't in the database yet; no links` + `<br><button onclick=\"document.getElementById('contributor-links').innerHTML=null;\">hide</button>`;}})");
                                    document.getElementById('contributor-buttons').appendChild(button);
                                    document.getElementById('contributor-buttons').innerHTML+= " ";
                                });
                            }

                            // LINKS (depreciate this)
                            {  
                                document.getElementById(`info-links`).innerHTML = `
                                <br>${Object.keys(data.links)
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

                                recreateNode(document.getElementById("info-date"));
                                const containerDate = document.getElementById(`info-date`);
                                containerDate.innerHTML = Object.keys(data["dates"])[0];
                                containerDate.addEventListener(
                                    "mouseover",
                                    () => {
                                       document.getElementById(`date-dropdown`).style=`
                                                top: ${mouseY + 7 + window.scrollY}px;
                                                left: ${Math.max(
                                                    Math.min(
                                                        mouseX + 10 + window.scrollX - (document.getElementById("date-dropdown").offsetWidth / 2), 
                                                        getViewportWidth() - 253.2), 
                                                    0)}px;
                                                visibility: visible;
                                            `;
                                    }
                                );
                                rapidlisteners ++;
                                containerDate.addEventListener(
                                    "mouseleave",
                                    () => {
                                        document.getElementById(`date-dropdown`).style.visibility = "hidden";
                                    }
                                );
                                rapidlisteners ++;
                            }

                            // CONTENTS
                            {
                                if (Object.keys(data).includes("contents")){
                                    document.getElementById("info-contents").removeAttribute("hidden");
                                    
                                    document.getElementById("contents-dropdown").innerHTML = data["contents"].map((track, index) => `<div>${index + 1}. ${track}</div>`).join('')

                                    recreateNode(document.getElementById("info-contents"));
                                    const containerContents = document.getElementById(`info-contents`);
                                    // containerDate.innerHTML = Object.keys(data["contents"])[0];
                                    containerContents.addEventListener(
                                        "mouseover",
                                        () => {
                                            
                                            document.getElementById(`contents-dropdown`).style=`
                                                top: ${mouseY + 7 + window.scrollY}px;
                                                left: ${Math.max(
                                                    Math.min(
                                                        mouseX + 10 + window.scrollX - (document.getElementById("contents-dropdown").offsetWidth / 2), 
                                                        getViewportWidth() - 253.2), 
                                                    0)}px;
                                                visibility: visible;
                                            `;
                                        }
                                    );
                                    rapidlisteners ++;
                                    containerContents.addEventListener(
                                        "mouseleave",
                                        () => {
                                            document.getElementById(`contents-dropdown`).style.visibility = "hidden";
                                        }
                                    );
                                    rapidlisteners ++;
                                } else {
                                    document.getElementById("info-contents").setAttribute("hidden", "hidden");
                                }
                            }

                            //MEDIA
                            {
                                recreateNode(document.getElementById("info-media"));
                                let viewMediaButton = document.getElementById("info-media");
                                if (Object.keys(data).includes('media')) {
                                    viewMediaButton.removeAttribute("hidden");
                                    viewMediaButton.addEventListener(
                                        "click",
                                        () => {
                                            let url = new URL("viewMedia.html", window.location.href);
                                            url.searchParams.append('path', path)
                                            window.open(url.toString(), "viewMedia", "width=600,height=620,menubar=no,toolbar=no");
                                        }
                                    );
                                } else {
                                    viewMediaButton.setAttribute("hidden", "hidden");
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

                    
                    // DATES
                    {

                        document.getElementById(`item-${title}-date`).addEventListener(
                            "mouseover",
                            () => {
                                document.getElementById(`item-${title}-date`).innerHTML = Object.keys(data["dates"])[0];
                            }
                        );
                        rapidlisteners ++;
                        document.getElementById(`item-${title}-date`).addEventListener(
                            "mouseleave",
                            () => {
                                document.getElementById(`item-${title}-date`).innerHTML = Object.keys(data["dates"])[0].substring(0,4);
                            }
                        );
                        rapidlisteners ++;
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
    console.log(rapidlisteners);
}).catch(error => {
    console.error("Error loading entries:", error);
});
