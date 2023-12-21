import json
import os
import time
from calendar import monthrange
from datetime import datetime, timedelta
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


database_id = 'atomic-todo'


class TodoBoard:
    def __init__(self, name, board_id):
        self.name = name
        self.id = board_id
        self.start_date = int(time.time())
        self.database_id = database_id
        self.collection_id = 'todoboards'

    def to_json(self):
        return json.dumps({
            'name': self.name,
            'startDate': self.start_date
        })


class Todo:
    def __init__(self, name, todo_id, completed, start_date, end_date, show_in_year, show_in_month, show_in_week):
        self.name = name
        self.id = todo_id
        self.completed = completed
        self.deleted = False
        self.start_date = start_date
        self.end_date = end_date
        self.show_in_year = show_in_year
        self.show_in_month = show_in_month
        self.show_in_week = show_in_week
        self.database_id = database_id
        self.collection_id = 'todos'

    def to_json(self):
        return json.dumps({
            'name': self.name,
            'completed': self.completed,
            'deleted': self.deleted,
            'startDate': self.start_date,
            'endDate': self.end_date,
            'showInYear': self.show_in_year,
            'showInMonth': self.show_in_month,
            'showInWeek': self.show_in_week
        })


run_date = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)
current_month_range = monthrange(run_date.year, run_date.month)
board = TodoBoard("Todo Board", "5769fdc6-d2fd-4526-8955-5cf6fe6a14e2")
todos = [
    Todo(
        name="Assigned to current year",
        todo_id='8722f10a-a26a-4ae9-a855-9c15034c0cf8',
        completed=False,
        start_date=int(datetime.timestamp(run_date.replace(month=1, day=1))),
        end_date=int(datetime.timestamp(run_date.replace(month=12, day=31, hour=23, minute=59, second=59))),
        show_in_year=True,
        show_in_week=True,
        show_in_month=True
    ),
    Todo(
        name='Assigned to current month',
        todo_id='c6d2ada5-3f82-42be-bb07-cc03d2b0ff87',
        start_date=int(datetime.timestamp(run_date.replace(day=1))),
        end_date=int(datetime.timestamp(run_date.replace(day=current_month_range[1], hour=23, minute=59, second=59))),
        completed=False,
        show_in_year=True,
        show_in_month=True,
        show_in_week=True
    ),
    Todo(
        name='Assigned to current week',
        todo_id='2d9814bb-efdd-443a-9cc9-ef73c22591d7',
        start_date=int(datetime.timestamp(run_date - timedelta(days=run_date.weekday()))),
        end_date=int(datetime.timestamp(run_date + timedelta(days=6, hours=23, minutes=59, seconds=59))),
        completed=False,
        show_in_year=True,
        show_in_month=True,
        show_in_week=True
    ),
    Todo(
        name='Assigned to current day',
        todo_id='64f8c222-9262-441b-9c9a-d5b8d6bb76cf',
        start_date=int(datetime.timestamp(run_date)),
        end_date=int(datetime.timestamp(run_date.replace(hour=23, minute=59, second=59))),
        completed=False,
        show_in_year=True,
        show_in_month=True,
        show_in_week=True
    ),
    Todo(
        name='Visible in day list only',
        todo_id='65bfb1e4-d041-49b5-8fe9-4f6bd2a37682',
        start_date=int(datetime.timestamp(run_date)),
        end_date=int(datetime.timestamp(run_date.replace(hour=23, minute=59, second=59))),
        completed=False,
        show_in_year=False,
        show_in_month=False,
        show_in_week=False
    ),
    Todo(
        name='Visible in day and week lists only',
        todo_id='5ff13d41-e3cf-461b-829d-598b955476d3',
        start_date=int(datetime.timestamp(run_date)),
        end_date=int(datetime.timestamp(run_date.replace(hour=23, minute=59, second=59))),
        completed=False,
        show_in_year=False,
        show_in_month=False,
        show_in_week=True
    ),
    Todo(
        name='Visible in day, week and month lists only',
        todo_id='1cd9a1a4-232a-4be9-a8be-d0b67ba1af08',
        start_date=int(datetime.timestamp(run_date)),
        end_date=int(datetime.timestamp(run_date.replace(hour=23, minute=59, second=59))),
        completed=False,
        show_in_year=False,
        show_in_month=True,
        show_in_week=True
    ),
    Todo(
        name='Assigned to week 46 2023 (tests week within month boundary)',
        todo_id='92754f14-0222-4610-98d5-d00f0a564f6b',
        completed=False,
        start_date=1699833600,
        end_date=1700438400,
        show_in_year=True,
        show_in_month=True,
        show_in_week=True
    ),
    Todo(
        name='Assigned to week 48 2023 (tests week over month boundary)',
        todo_id='9f2fdcf4-48dd-480d-a63d-edf3a8f290d0',
        completed=False,
        start_date=1701043200,
        end_date=1701648000,
        show_in_year=True,
        show_in_month=True,
        show_in_week=True
    ),
    Todo(
        name='Assigned to week 52 2023 (tests week falls within year boundary)',
        todo_id='86db32a1-a901-46ed-9a99-24725e6c9a9e',
        completed=False,
        start_date=1703462400,
        end_date=1704067200,
        show_in_year=True,
        show_in_month=True,
        show_in_week=True
    ),
    Todo(
        name='Assigned to week 52 2024 (tests week over year boundary)',
        todo_id='8517009d-3903-4cb3-a93f-a7502e19a958',
        completed=False,
        start_date=1735516800,
        end_date=1736121600,
        show_in_year=True,
        show_in_month=True,
        show_in_week=True
    )
]


def load_boards():
    databases.create_document(
        board.database_id,
        board.collection_id,
        board.id,
        board.to_json()
    )


def load_todos():
    for todo in todos:
        databases.create_document(
            todo.database_id,
            todo.collection_id,
            todo.id,
            todo.to_json()
        )


load_boards()
load_todos()
