import json
import csv
import os

f = open('./data/entryData.json')
datajson = json.load(f)
f.close()

data = {}
for entry in datajson:
    tags = entry["tags"]
    for tag in tags:
        if not (tag in data):
            data[tag] = 1
        else:
            data[tag] += 1
        
print(data)
with open('./data/tags.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["name", "is_hidden", "count"])
    for key in data.keys():
        writer.writerow([key, "false", data[key]])