async function renderElement(title) {
    let audiocount = 0;

    const path = title.toLowerCase().replaceAll(" ", "-");


    let el_links = document.createElement('span');
    el_links.id = `${title}-links`;

    let el_dates = document.createElement('span');
    el_dates.id = `${title}-dates`;

    let el_description = document.createElement('span');
    el_description.id = `${title}-description`;

    let el_category = document.createElement('span');
    el_category.id = `${title}-category`;

    let el_tags = document.createElement('span');
    el_tags.id = `${title}-tags`;

    let el_contributors = document.createElement('span');
    el_contributors.id = `${title}-contributors`;

    let el_contents = document.createElement('span');
    el_contents.id = `${title}-contents`;

    let el_audio = document.createElement('span');
    el_audio.id = `${title}-audio`;
    
    let el_media = document.createElement('span');
    el_media.id = `${title}-media`;


    let element_fields = [
        el_links,
        el_dates,
        el_description,
        el_category,
        el_tags,
        el_contributors,
        el_contents,
        el_audio,
        el_media
    ]

    let people;


    // PEOPLE.JSON
    {
        try {
            const response = await fetch("../data/personData.json");
            if (response.ok) {
                people = await response.json();
            } 
        } catch (error) {}
    }

    // DESCRIPTION.TXT
    {
        try {
            const response = await fetch('./'+path+"/description.txt");
            if (response.ok) {
                const file = await response.text();
                if (file.length != 0) {
                    el_description.innerHTML = `
                        <b>Description</b>:
                        <div class="indent">${file}</div>
                    `;
                } else {
                    el_description.innerHTML = `
                        <b>Description</b>: <span class="error">description is empty</span>
                    `;
                }
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
                el_tags.innerHTML = `
                    <b>Tags</b>:
                        ${data.tags.map(tag => `${tag}`).join(" | ")}
                    <br>
                `;

                // CATEGORY
                el_category.innerHTML = `
                    <b>Category</b>:
                    ${data.categories[0]}
                    <br>
                `;

                // CONTRIBUTORS
                el_contributors.innerHTML = `<b>Contributors</b>: <br>`
                Object.keys(data.contributors).forEach(contributor => {
                    let el_contributor = document.createElement("span");
                    el_contributor.style = 'padding-left: 40px;'
                    let contributor_lo = contributor.toLowerCase()

                    el_contributor.innerHTML = `
                        <b>${contributor}</b>:  ${data.contributors[contributor]} <br>
                        
                        <span style="padding-left: 80px;">
                            ${Object.keys(people[contributor.toLowerCase()]).map(linkTitle => 
                                `<a href="${people[contributor_lo][linkTitle]}">${linkTitle}</a> | `
                            ).join("")}
                        </span>
                    `;

                    el_contributors.appendChild(el_contributor)
                    el_contributors.innerHTML += ' <br> '
                });
                    

                // DATES
                el_dates.innerHTML = `
                    <b>Date(s)</b>:
                    <br>
                    ${Object.keys(data.dates).map(date => `
                        <span class="indent">
                            ${date}: ${data["dates"][date]}
                        </span>
                        <br>
                    `).join('')}
                `

                // CONTENTS
                if (Object.keys(data).includes("contents")){
                    el_contents.innerHTML = `
                        <b>Tracklist</b>:
                        <ol>
                            ${data.contents.map((track) => `<li>${track}</li>`).join(``)}
                        </ol>
                    `;
                } 

                // LINKS
                if (Object.keys(data).includes("links")) {
                    el_links.innerHTML = `
                    <b>Links</b>: ${Object.keys(data.links)
                        .map(link => {
                            let url = data.links[link];
                            if (url.startsWith("./content/")) {
                                url = "."+url;
                            } 
                            return `<a href="${url}" target="_blank">${link}</a>
                        `}).join(" | ")}
                    <br>
                    `;
                }

                // AUDIO
                if(Object.keys(data).includes("audio")) {
                    // <audio controls src='${path}/audio/${filename}' type='audio/mp3'></audio>
                    el_audio.innerHTML = `
                        <b>Audio</b>:
                        <br>
                        ${data.audio.map((filename) => `
                            <audio controls src='${path}/audio/${filename}' type='audio/mpeg'></audio> | <a href='${path}/audio/${filename}' download>${filename}</a>
                        `).join("<br>")}
                        <br>
                    `;
                }


                //MEDIA
                if(Object.keys(data).includes("media")) {
                    el_media.innerHTML = `
                        <b>Media</b>:
                        <br><br>
                        ${Object.keys(data.media).map(filename => `
                            <span class="media-item">
                                <a href="${path}/${filename.replace(" ", "-")}" target="_blank">
                                    <img src="${path}/${filename.replace(" ", "-")}" width="250px"><br>
                                </a>
                                <span>${data.media[filename]}</span>
                            </span>
                        `).join("")}
                    `;
                }

                
            } else {
                document.getElementById(`${title}-dates`).innerHTML = "<span class='error'>data file missing, or some other worse error</span><br>";
            }
        } catch (error) {}
    }

    
    let element = document.createElement("div");
    element.className="item";
    // element.id = (title);

    element.innerHTML = `<span class="title" id="${title}-title">${title}</span><br><br>`
    element_fields.forEach(field => {
        // console.log(field)
        element.appendChild(field);
    });

    return element;
}

const params = Object.fromEntries(new URLSearchParams(window.location.search));

if (Object.keys(params).includes("entry")) {


    const title = params["entry"]
    renderElement(title).then(element => 
        document.getElementById("content").appendChild(element)
    );
    
    document.getElementById("extras").remove();

} else {
    fetch("./index.json").then(res => res.json()).then(index => {
       
        // First go through all of the entries in index.json, and create placeholder divs for all of them in the correct order 
        Object.keys(index).forEach(title => {
            
            let item_container = document.createElement("div");
            item_container.id=title;
            document.getElementById("content").appendChild(item_container)

        });


        // Again, go through index.json, and fill in all of the placeholder divs with correct info. Does this asynchrously. 
        Object.keys(index).forEach(async title => {
            renderElement(title).then(
                element => {
                    document.getElementById(title).appendChild(element);
                    document.getElementById(title).innerHTML += "<br><hr><br>";
                }
            );
        });
    });

      
    
    
}



