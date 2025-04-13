for website redesign. 
reads from data.json and renders to html instead of me manually writing everything myself. 
this solution is much more scalable, but most importantly it's also a cooler implementation and is fun!

---
to add stuff to `entryData.json`, use the code snippets prefixes:
 - **entry** - adds syntax for an entire item object
 - **pair** - adds syntax for a normal pair
 - **contents** - adds syntax for the contents body (when tracklist is used)

there's also `personData.json` which is used to keep track of people's external links when they are listed as a collaborator in `entryData.json`

<br>  
---
TODOS:
- [ ] index everything
    - [ ] collaborators
    - [ ] music
    - [ ] contraptions
    - [ ] all videos (livestreams stay seperate)
    - [ ] random other stuff (writings, shitposts, whatever other garbage)
- [ ] implement rendering for
    - [x] descriptions when applicable
    - [ ] proper iframe rendering for when src is specified
    - [ ] cover artwork when applicable
    - [ ] automatic embeds
        - [ ] bandcamp (API?)
        - [ ] soundcloud (API?)
- [x] filter entries by tags
- [ ] sections for
    - [x] contraptions
    - [ ] videos
    - [ ] writings
    - [ ] other
- [ ] restore whimsy
- [ ] rare eclipse event (with original OST by hans zimmer and bald1)



