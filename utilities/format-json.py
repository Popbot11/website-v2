# this script goes through the entryData.json file and formats 
# its contents into folders and also creates an index.json in that directory. 

# later, i need to create a script that can just sort the index.json file without needing the original data. 
# for now tho, this is fine. 

# This script currently isn't needed anymore because add-entry.py does about everything automatically. 

import json
import os

f = open('./data/entryData.json')
datajson = json.load(f)
f.close()


index = {}
for entry in datajson:
    contents = {
        'date': "",
        'category': "",
    }
    contents['date'] = list(entry["dates"])[0]
    contents['category'] = list(entry["categories"])[0]

    index[entry["title"]] = contents
    os.makedirs(("./content/"+entry["title"].lower().replace(" ", "-")), exist_ok=True)

    data=entry
    # if the file doesn't exist, create it and set its contents to be whatever's in the description.
    # otherwise, leave teh file alone. it didnt do anything wrong. 
    try:
        with open("./content/"+entry["title"].lower().replace(" ", "-")+"/description.txt", 'x') as xfile:
            with open("./content/"+entry["title"].lower().replace(" ", "-")+"/description.txt", 'w') as file:
                try:
                    print(entry['description'])
                    file.write(entry['description'])
                except:
                    pass
    except:
        pass

    data.pop('description', None)
    # f = open("./content/"+entry["title"]+"/data.json", "w")
    with open("./content/"+entry["title"].lower().replace(" ", "-")+"/data.json", 'x') as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False)
    # print (data, '\n')


index = dict(sorted(index.items(), key=lambda x: 
                    (''.join(c for c in x[1]['date'] if not c.isalpha())), 
                    reverse=True))

# for item in index:
#     print(item, "\n\t", index[item])

with open('./content/index.json', 'w') as jsonfile:
    json.dump(index, jsonfile, indent=4, ensure_ascii=False)
 



    

