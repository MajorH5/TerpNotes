from dotenv import load_dotenv
import requests
import os
import json

load_dotenv()
if __name__ == "__main__":
    course_list = []
    nextHundred = [{"dummy":0}]
    count = 0
    while nextHundred != []:
        nextHundred = requests.get(f"https://api.planetterp.com/v1/courses?offset={count}").json()
        for i in nextHundred:
            course_list.append(i)
        count += 100
        print(count)
    with open('data.json', 'w') as fp:
        json.dump(course_list, fp)