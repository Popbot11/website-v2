g = "sjhfsdAUYGKUH"
print(g.lower())


try:
    num = int(input("num: "))
except ValueError:
    print("Please enter a valid integer")
    num = 0
for i in range(num):
    print(i)