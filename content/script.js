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


    
    });
})