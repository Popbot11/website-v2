for website redesign. 
reads from data.json and renders to html instead of me manually writing everything myself. 
this solution is much more scalable, but most importantly it's also a cooler implementation and is fun!

---
to add stuff to `data.json`, use the code snippets prefixes:
 - **item** - adds syntax for an entire item object
 - **contributor** - adds syntax for a collaborator / contributor
 - **date** - adds syntax for a date + entry pair  

<br>  

each item has the following fields:
 - **title** - the title of the item
 - **href** - the link to the item's associated page on my website. generally this just contains a description, some embeds, and maybe some images
 - **dates** - a list of dates and associated "changelog" entries for the item. Normally an item will only have one date, which is it's creation date. any subsequent dates are updates. 
 - **categories** - one (or more if applicable) of the following categories: `music, contraption, video, writing, other`. These categories are used to visually separate and better sort entries on the home page. 
 - **tags** - extra modifiers that are less important for the visual organization of the homepage. These can be anything, but in most cases will refer to specific qualities. For example, in the case of an item in the `music` category, it may have the `album` tag. or maybe for a contraption, it could have the `paid` tag. these could be used to filter items on the homepage, and just generally provide some more contextual information since most of the time people wouldn't be able to simply distinguist items by name, date, and category alone. This is particularly meaningful for items in the `music` category because most entries are singles. 
 - **contributors** - a list of people that contributed to the given item. Ever item will have myself as a contributor since i mean like this is my website lmao. but for collaborative projects, i'll also list all the other people that worked on the project, along with their respective role if i can remember it. 