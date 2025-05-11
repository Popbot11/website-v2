import json
import os
import sys
from datetime import datetime

title = input("entry title: ")
category = input("category (music, contraption, video, other): ").lower()
while (category not in {"music", "contraption", "video", "other"}):
    category=input("\tinvalid category. try again: ")
description = input("temp description: ")

date=""
if input("use today's date? (y/n) ").lower() == "y":
    date= datetime.today().strftime('%Y-%m-%d')        
else:
    date=input("\trelease date: ")


while True:
    try:
        numContents = int(input("how many tracks/items? (0 to exclude field): "))
        break
    except ValueError:
        print("Please enter a valid number")
if numContents == 0:
    contents=[]
else:
    contents = []
    for i in range(numContents):
        contents.append(input("\titem #"+ str(i+1) + ": "))

print("enter tags. enter 'done' to continue\nsome common tags are: [collab, single, ep, album, tutorial, shitpost, wip]")
tag = ""
tags = []
while True:
    tag = input("\tadd tag: ")
    if (tag == "done"):
        break
    tags.append(input("\tadd tag: "))

print("enter link titles (NOT URLS). enter 'done' to continue: ")
link = ""
links = {}
while True:
    link = input("\tenter link text: ")
    if link == "done":
        break
    links[link] = input("\turl: ")

includeMedia = True
if input("include media? (y/n): ") != "y":
    includeMedia = False


print("-----------")
print("\ttitle: "+title)
print("\tcategory: "+category)
print("\tdescription: "+description)
print("\tdate: "+date)
print("\tcontents: "+str(contents))
print("\ttags: "+str(tags))
print("\tlinks: "+str(links))
if input("continue with entry creation? (y/n): ") != "y":
    print("exiting...")
    sys.exit()
print("-----------")



f = open('./content/_template/data.json')
templatedata = json.load(f)

templatedata["title"] = title
templatedata["categories"][0] = category
templatedata["dates"][date] = "published"
if contents == []:
    del templatedata["contents"]
else:
    templatedata["contents"] = contents
templatedata["tags"] = tags
templatedata["links"] = links
if not includeMedia:
    del templatedata["media"]


# MAKE FOLDER, POPULATE WITH BASIC FILES
try:
    # create description file. if the directory already exists, error
    os.makedirs("./content/"+title.lower().replace(" ", "-"))
    with open("./content/"+title.lower().replace(" ", "-")+"/data.json", "x") as datafile:
        json.dump(templatedata, datafile, indent=4)
        print("\twrote template data to data.json")
    with open("./content/"+title.lower().replace(" ", "-")+"/description.txt", "x") as descriptionfile:
        descriptionfile.write(description)
        print("\twrote description to description.txt")
except:
    print("an entry of this title already exists")


# APPEND INFO TO index.json
with open('./content/index.json', 'r+') as indexfile:
    indexdata = json.load(indexfile)
    indexdata[title] = {
        "category": category,
        "date": date
    }   
    indexdata = dict(sorted(indexdata.items(), key=lambda x: 
                    (''.join(c for c in x[1]['date'] if not c.isalpha())), 
                    reverse=True))
    indexfile.seek(0)
    json.dump(indexdata, indexfile, indent=4)
    print("\tupdated index.json")

print("done! make sure to go and check to verify that everything's correct, and to add anything that this script doesn't automate")
print("add link urls, webpage, media, collaborators, etc")
# indexdata = json.load(open("./content/index.json"))
# indexdata = dict(sorted(indexdata.items(), key=lambda x: 
#                     (''.join(c for c in x[1]['date'] if not c.isalpha())), 
#                     reverse=True))

# with open('./content/index.json', 'w') as indexfile:
#     json.dump(indexfile, indexdata, indent=4)
    