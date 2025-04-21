import json
import csv

f = open('./data/entryData.json')
datajson = json.load(f)
f.close()

data = []
for entry in datajson:
    row = [
        list(entry["dates"])[0],
        list(entry["categories"])[0],
        entry["title"]
    ]
    data.append(row)

data.sort(key=lambda x: x[0])

with open('./data/entryData.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(data)
    

