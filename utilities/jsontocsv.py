import json
import csv
import os

f = open('./data/entryData.json')
datajson = json.load(f)
f.close()

data = {}
for entry in datajson:
    contents = {
        'date': "",
        'category': "",
    }
    contents['date'] = list(entry["dates"])[0]
    contents['category'] = list(entry["categories"])[0]

    data[entry["title"]] = contents
    os.makedirs(("./content/"+entry["title"]), exist_ok=True)


with open('./content/index.json', 'w') as jsonfile:
    json.dump(data, jsonfile, indent=4)
 



    

