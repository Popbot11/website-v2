# -*- coding: utf-8 -*-
# go through index.json, and for each entry open the corrosponding data.json. 
# add each username to a big list, remove all duplicates
# for each username, add it to a new list if:
    # it's included in personData.json but doesn't have any fields
    # it's not included in perdonData.json at all


import json
import sys


# assemble list of all people mentioned at any point
people_all = []
with open('./content/index.json', 'rb') as f:
    index = json.load(f)
    for title in index.keys():
        with open("./content/"+title.lower().replace(" ", "-")+"/data.json", "r", encoding="utf-8") as datafile:
            for person in (json.load(datafile))["contributors"]:
                if (person not in people_all):
                    people_all.append(person)

# assemble a list of people who do not yet have any data associated with them
people_todo = []
with open("./data/personData.json", 'rb') as f:
    people = json.load(f)
    # print(people.keys())
    for person in people.items():
        if person[1] == {}:
            people_todo.append(person[0])
    for person in people_all:
        if (person.lower() not in people.keys()):
            people_todo.append(person)


people_todo.sort()
# print("\n".join(people_todo))

# go through each person, and automatically prompt the user to add links
print("type 'done' to go to the next person. enter 'exit' to quit entirely without saving the current person. ")
for person in people_todo:
    print(person + ": ")
    links = {}
    while True:
        link_text = input("\tenter link text: ")
        if (link_text == 'done'):
            print(links)
            persondata = {}
            with open('./data/personData.json', 'r') as f:
                persondata = json.load(f)
                persondata[person] = links
            with open('./data/personData.json', 'w') as f:
                f.seek(0)
                json.dump(persondata, f, indent=4, ensure_ascii=False)
                
                
                print("\tupdated personData.json")
            break
        elif (link_text == 'exit'):
            print(links)
            sys.exit()
        else: 
            links[link_text] = input("\tenter link url:  ")





