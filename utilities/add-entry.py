import json
import os
from datetime import datetime

title = input("entry title: ")
category = input("category (music, contraption, video, other): ").lower()
while (category not in {"music", "contraption", "video", "other"}):
    category=input("invalid category. try again: ")
description = input("temp description: ")

date=""
if input("use today's date? (y/n) ").lower() == "y":
    date= datetime.today().strftime('%Y-%m-%d')        
else:
    date=input("release date: ")
        



f = open('./content/_template/data.json')
templatedata = json.load(f)


templatedata["title"] = title
templatedata["categories"][0] = category
templatedata["dates"][date] = "published"


print(templatedata)


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

# indexdata = json.load(open("./content/index.json"))
# indexdata = dict(sorted(indexdata.items(), key=lambda x: 
#                     (''.join(c for c in x[1]['date'] if not c.isalpha())), 
#                     reverse=True))

# with open('./content/index.json', 'w') as indexfile:
#     json.dump(indexfile, indexdata, indent=4)
    