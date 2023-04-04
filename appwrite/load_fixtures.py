import json
import os
# pip3 install appwrite
from appwrite.client import Client
from appwrite.services.databases import Databases

api_key = os.getenv('API_KEY')

client = (
    Client()
    .set_endpoint('http://localhost/v1')
    .set_project('atomic-todo')
    .set_key(api_key))

databases = Databases(client)

boards_file = open('boards.json')
lists_file = open('lists.json')
todos_file = open('todos.json')


def load_boards():
    docs = json.load(boards_file)
    for doc in docs:
        databases.create_document(
            doc.get('$databaseId'),
            doc.get('$collectionId'),
            doc.get('$id'),
            json.dumps({
                'name': doc.get('name'),
                'days': doc.get('days'),
                'weeks': doc.get('weeks'),
                'months': doc.get('months')
            })
        )


def load_lists():
    docs = json.load(lists_file)
    for doc in docs:
        databases.create_document(
            doc.get('$databaseId'),
            doc.get('$collectionId'),
            doc.get('$id'),
            json.dumps({
                'name': doc.get('name'),
                'level': doc.get('level'),
                'todos': doc.get('todos'),
                'startDate': doc.get('startDate'),
                'parentList': doc.get('parentList'),
                'childLists': doc.get('childLists')
            })
        )


def load_todos():
    docs = json.load(todos_file)
    for doc in docs:
        databases.create_document(
            doc.get('$databaseId'),
            doc.get('$collectionId'),
            doc.get('$id'),
            json.dumps({
                'name': doc.get('name'),
                'completed': doc.get('completed')
            })
        )


load_boards()
load_lists()
load_todos()

boards_file.close()
lists_file.close()
todos_file.close()
