fetch("./index.json").then(res => res.json()).then(index => {
    // this goes through and creates all of the nessisary item divs in the correct order
    // this has to be done first because all their contents will be loaded asynchronously
    console.log(index);
    Object.keys(index).forEach(async title => {
        let element = document.createElement("div");
        element.className="item";
        element.id = (title);
        element.innerHTML = `
            <span class="title" id="${title}-title">${title}</span><br>
            <div class="category" id="${title}-category"></div>
            <div class="tags" id="${title}-tags"></div>
            <div class="contributors" id="${title}-contributors"></div>
            <div class="contributor-links" id="${title}-contributor-links"></div>
            <div class="dates" id="${title}-dates"></div>
            <div class="description" id="${title}-description"></div>
            <div class="contents" id="${title}-contents"></div>
            <hr>
            
        `
        document.getElementById("content").appendChild(element);

        // DESCRIPTION.TXT
        {
            try {
                const response = await fetch('./'+title+"/description.txt");
                if (response.ok) {
                    const file = await response.text();
                    document.getElementById(`${title}-description`).innerHTML += (file + "<br><br>");
                } else {
                    document.getElementById(`${title}-description`).remove()
                }
            } catch (error) {}
        }

        // DATA.JSON
        {
            try {
                const response = await fetch('./'+title+"/data.json");
                if (response.ok) {
                    const file = await response.json();
                    
                    // TAGS
                    {
                        document.getElementById(`${title}-tags`).innerHTML += `
                            Tags:
                            ${file.tags.map(tag => `${tag}`).join(" | ")}
                            <br>
                        `;
                    }

                    // CATEGORY
                    {
                        document.getElementById(`${title}-category`).innerHTML += `
                            Category:
                            ${file.categories[0]}
                            <br>
                        `;
                    }

                    // CONTRIBUTORS
                    {
                        // let element = document.createElement("span");
                        let target = document.getElementById(`${title}-contributors`)
                        target.innerHTML += "Contributors:"
                        Object.keys(file.contributors).forEach(contributor => {
                            
                            let button = document.createElement("button");
                            button.innerHTML = contributor
                            button.setAttribute("onclick", "fetch('../data/personData.json').then(res => res.json()).then(personData => {try{document.getElementById('"+title+"-contributor-links').innerHTML = `<b>"+contributor+":</b> "+file.contributors[contributor]+"<br><b>Links:</b> ${Object.keys(personData['"+contributor.toLowerCase()+"']).map(text => \"<a href='\"+personData['"+contributor.toLowerCase()+"'][text]+\"'>\"+text+\"</a>\").join(' | ')}` + `<br><button onclick=\"document.getElementById('"+title+"-contributor-links').innerHTML=null;\">hide</button>`;}catch{document.getElementById('"+title+"-contributor-links').innerHTML = `<b>"+contributor+"</b>: "+file.contributors[contributor]+"<br><b>Links:</b>  isn't in the database yet; no links` + `<br><button onclick=\"document.getElementById('"+title+"-contributor-links').innerHTML=null;\">hide</button>`;}})");
                            target.appendChild(button)
                            target.innerHTML += " | "
                        });
                        
                    }

                    // DATES
                    {

                    }

                    // CONTENTS
                    {

                    }
                } else {
                    document.getElementById(`${title}-dates`).innerHTML = "data file missing<br>"
                }
            } catch (error) {}
        }

        // 
    
    });
})