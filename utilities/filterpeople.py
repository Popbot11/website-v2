import csv

people = []

with open('./data/people.csv', newline='', encoding='utf-8') as csvfile:
    spamreader = csv.reader(csvfile, quotechar='|')
    for row in spamreader:
        people.append(row[0])

people = list(dict.fromkeys(people))
print(people)

with open("checklist.txt", "w", encoding="utf-8") as f:
    for person in people:
        f.write("\""+person.lower()+"\": {\n\t\n},\n")