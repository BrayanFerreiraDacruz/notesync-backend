import os
import datetime
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
# my_calendar.py

def create_event(title, description, start_datetime):
    """
    Função mock para simular criação de evento no Google Calendar.
    Retorna um link fictício para o evento.
    """
    print(f"[Simulação] Criando evento: {title} - {description} em {start_datetime}")
    fake_event_link = "https://calendar.google.com/event?eid=EXEMPLO123"
    return fake_event_link


SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    creds = None

    if os.path.exists('token.json'):
        with open('token.json', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(
            'client_secret.json', SCOPES)
        creds = flow.run_local_server(port=0)
        with open('token.json', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)
    return service

def create_event(title, description, start_datetime):
    service = get_calendar_service()

    event = {
        'summary': title,
        'description': description,
        'start': {
            'dateTime': start_datetime.isoformat(),
            'timeZone': 'America/Sao_Paulo',
        },
        'end': {
            'dateTime': (start_datetime + datetime.timedelta(hours=1)).isoformat(),
            'timeZone': 'America/Sao_Paulo',
        },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    return event.get('htmlLink')
