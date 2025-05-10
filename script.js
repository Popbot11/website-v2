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

// track mouse position
let mouseX;
let mouseY;

document.addEventListener(
    "mousemove",
    (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        document.getElementById("mousecoords").innerHTML = `
                debug stuff:
                X: ${mouseX} |
                Y: ${mouseY} |
                scroll: ${window.scrollY} | 
                vp width: ${getViewportWidth()}`;
    }
);

// TOOD: detech when the page is too narrow and show a poppup that prompts users to go to expert mode
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
            <span class="tags" id="item-${title}-tags">tag, tag, tag</span>
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
                                    <b>Description</b>: <span class="error">description is empty</span>
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

                            // DATES
                            {
                                document.getElementById(`${title}-dates`).innerHTML += "<b>Date(s)</b>:<br>"
                                for (const date of Object.keys(data["dates"])) {
                                    document.getElementById(`${title}-dates`).innerHTML += `
                                        <span class="indent">${date}: ${data["dates"][date]}</span><br>
                                    `
                                }
                            }

                            // CONTENTS
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

                            // LINKS
                            {
                                if (Object.keys(data).includes("links")) {
                                    document.getElementById(`${title}-links`).innerHTML += `
                                    <b>Links</b>: ${Object.keys(data.links).map(link => `<a href="${data.links[link]}" target="_blank">${link}</a>`).join(" | ")}
                                    `;
                                } else {
                                    document.getElementById(`${title}-links`).remove();
                                }
                            }

                            //MEDIA
                            {
                                if(Object.keys(data).includes("media")) {
                                    document.getElementById(`${title}-media`).innerHTML += "<b>Media</b>:<br><br>";
                                    for (const filename of Object.keys(data.media)) {
                                        const imgPath = `${path}/${filename.replace(" ", "-")}`;
                                        document.getElementById(`${title}-media`).innerHTML += `
                                        
                                        <span class="media-item">
                                            <a href="${imgPath}" target="_blank">
                                                <img src="${imgPath}" width="250px"><br>
                                            </a>
                                            <span>${data.media[filename]}</span>
                                        </span>
                                        
                                        `;
                                    }
                                }else {
                                    document.getElementById(`${title}-media`).remove();
                                }
                            }

                        } else {
                            document.getElementById(`${title}-dates`).innerHTML = "<span class='error'>data file missing, or some other worse error</span><br>";
                        }
                    } catch (error) {}
                }
            }
        );
        
        
        
        // switch (index[title]["category"]) {
        //     case "music": 
        //         console.log("music");
        //         document.getElementById("container-music").appendChild(element);
        //         break;
        // }

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

                    // CONTENTS
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

                    // LINKS
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