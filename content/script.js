fetch("./index.json").then(res => res.json()).then(index => {
    // this goes through and creates all of the nessisary item divs in the correct order
    // this has to be done first because all their contents will be loaded asynchronously
    console.log(index);
    Object.keys(index).forEach(async title => {
        const path = title.toLowerCase().replaceAll(" ", "-")
        let element = document.createElement("div");
        element.className="item";
        element.id = (title);
        element.innerHTML = `
            <span class="title" id="${title}-title">${title}</span><br><br>
            <div class="links" id="${title}-links"></div>
            <div class="dates" id="${title}-dates"></div>
            <div class="description" id="${title}-description"></div>
            <div class="category" id="${title}-category"></div>
            <div class="tags" id="${title}-tags"></div>
            <div class="contributors" id="${title}-contributors"></div>
            <div class="contributor-links" id="${title}-contributor-links"></div>
            <div class="contents" id="${title}-contents"></div>
            <div class="audio" id="${title}-audio"></div>
            <div class="media" id="${title}-media"></div>
            <hr>
            
        `;
        document.getElementById("content").appendChild(element);

        // DESCRIPTION.TXT
        {
            try {
                const response = await fetch('./'+path+"/description.txt");
                if (response.ok) {
                    const file = await response.text();
                    if (file.length != 0) {
                        document.getElementById(`${title}-description`).innerHTML += `
                            <b>Description</b>:
                            <div class="indent">${file}</div>
                        `;
                    } else {
                        document.getElementById(`${title}-description`).innerHTML += `
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
                const response = await fetch('./'+path+"/data.json");
                if (response.ok) {
                    const data = await response.json();
                    
                    // TAGS
                    {
                        document.getElementById(`${title}-tags`).innerHTML += `
                            <b>Tags</b>:
                            ${data.tags.map(tag => `${tag}`).join(" | ")}
                            <br>
                        `;
                    }

                    // CATEGORY
                    {
                        document.getElementById(`${title}-category`).innerHTML += `
                            <b>Category</b>:
                            ${data.categories[0]}
                            <br>
                        `;
                    }

                    // CONTRIBUTORS
                    {
                        // let element = document.createElement("span");
                        let target = document.getElementById(`${title}-contributors`)
                        target.innerHTML += "<b>Contributors</b>: "
                        Object.keys(data.contributors).forEach(contributor => {
                            // console.log(contributor);
                            let button = document.createElement("button");
                            button.innerHTML = contributor
                            button.setAttribute("onclick", "fetch('../data/personData.json').then(res => res.json()).then(personData => {try{document.getElementById('"+title+"-contributor-links').innerHTML = `<b>"+contributor+":</b> "+data.contributors[contributor]+"<br><b>Links:</b> ${Object.keys(personData['"+contributor.toLowerCase()+"']).map(text => \"<a target='_blank' href='\"+personData['"+contributor.toLowerCase()+"'][text]+\"'>\"+text+\"</a>\").join(' | ')}` + `<br><button onclick=\"document.getElementById('"+title+"-contributor-links').innerHTML=null;\">hide</button>`;}catch{document.getElementById('"+title+"-contributor-links').innerHTML = `<b>"+contributor+"</b>: "+data.contributors[contributor]+"<br><b>Links:</b>  isn't in the database yet; no links` + `<br><button onclick=\"document.getElementById('"+title+"-contributor-links').innerHTML=null;\">hide</button>`;}})");
                            target.appendChild(button)
                            target.innerHTML += " | "
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
                            <b>Links</b>: ${Object.keys(data.links)
                                .map(link => {
                                    let url = data.links[link];
                                    if (url.startsWith("./content/")) {
                                        url = "."+url;
                                    } 
                                    return `<a href="${url}" target="_blank">${link}</a>
                                `}).join(" | ")}
                            `;
                        } else {
                            document.getElementById(`${title}-links`).remove();
                        }
                    }

                    // AUDIO
                    {
                        if(Object.keys(data).includes("audio")) {
                            // <audio controls src='${path}/audio/${filename}' type='audio/mp3'>
                            document.getElementById(`${title}-audio`).innerHTML = `
                                <b>Audio</b>:<br>
                                ${data.audio.map((filename) => `
                                    <audio controls src='${path}/audio/${filename}' type='audio/mp3'></audio> | <a href='${path}/audio/${filename}' download>${filename}</a>
                                `).join("<br>")}
                            `;
                        // console.log(data.audio);
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
    
    });
}).then( () => {
    // scroll to entry in urlsearchparams
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    if (Object.keys(params).includes("entry")) {
        const entry = params["entry"]
        // console.log(entry);
        document.getElementById(entry).scrollIntoView();
        window.scrollBy(0, -25);
        document.getElementById("home").remove();
    }
})
