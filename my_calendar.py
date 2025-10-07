from google.oauth2 import service_account
from googleapiclient.discovery import build
import datetime
import os

CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "credentials.json")
SCOPES = ["https://www.googleapis.com/auth/calendar"]

def create_event(title, description, start_datetime):
    """
    Cria um evento real no Google Calendar usando credenciais de serviço.
    """
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES
    )

    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": title,
        "description": description,
        "start": {
            "dateTime": start_datetime.isoformat(),
            "timeZone": "America/Sao_Paulo",
        },
        "end": {
            "dateTime": (start_datetime + datetime.timedelta(hours=1)).isoformat(),
            "timeZone": "America/Sao_Paulo",
        },
    }

    event_result = service.events().insert(calendarId="primary", body=event).execute()

    return event_result.get("htmlLink")
