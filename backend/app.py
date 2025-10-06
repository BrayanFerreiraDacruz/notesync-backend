from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///noteaqui.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "super-secret-key-for-noteaqui")

db = SQLAlchemy(app)

# --- Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    timezone = db.Column(db.String(50), default="America/Sao_Paulo")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    events = db.relationship("Event", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "bio": self.bio,
            "phone": self.phone,
            "location": self.location,
            "timezone": self.timezone,
            "created_at": self.created_at.isoformat()
        }

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(5), nullable=True)  # HH:MM format
    location = db.Column(db.String(200), nullable=True)
    type = db.Column(db.String(50), default="event") # e.g., meeting, task, reminder, event
    priority = db.Column(db.String(50), default="medium") # e.g., low, medium, high
    status = db.Column(db.String(50), default="pending") # e.g., pending, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "date": self.date.isoformat(),
            "time": self.time,
            "location": self.location,
            "type": self.type,
            "priority": self.priority,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }

# --- Helper Functions ---
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
        except:
            return jsonify({"message": "Token is invalid or expired!"}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# --- Routes ---

@app.route("/api/test", methods=["GET"])
def test_connection():
    return jsonify({
        "status": "success",
        "message": "Backend NoteAqui funcionando!",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "Nome, email e senha são obrigatórios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email já registrado"}), 409

    new_user = User(name=name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    token = jwt.encode({
        "user_id": new_user.id,
        "email": new_user.email,
        "exp": datetime.utcnow() + timedelta(days=30)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({
        "success": True,
        "token": token,
        "user": new_user.to_dict()
    }), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Credenciais inválidas"}), 401

    token = jwt.encode({
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(days=30)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({
        "success": True,
        "token": token,
        "user": user.to_dict()
    })

@app.route("/api/auth/validate", methods=["GET"])
@token_required
def validate_token(current_user):
    return jsonify({
        "user": current_user.to_dict()
    })

@app.route("/api/events", methods=["GET"])
@token_required
def get_events(current_user):
    start_date_str = request.args.get("start_date")
    end_date_str = request.args.get("end_date")

    query = Event.query.filter_by(user_id=current_user.id)

    if start_date_str:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        query = query.filter(Event.date >= start_date)
    if end_date_str:
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        query = query.filter(Event.date <= end_date)

    events = query.order_by(Event.date, Event.time).all()
    return jsonify({"success": True, "events": [event.to_dict() for event in events]})

@app.route("/api/events", methods=["POST"])
@token_required
def create_event(current_user):
    data = request.get_json()
    title = data.get("title")
    date_str = data.get("date")

    if not title or not date_str:
        return jsonify({"message": "Título e data são obrigatórios"}), 400

    try:
        event_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Formato de data inválido. Use YYYY-MM-DD"}), 400

    new_event = Event(
        user_id=current_user.id,
        title=title,
        description=data.get("description"),
        date=event_date,
        time=data.get("time"),
        location=data.get("location"),
        type=data.get("type", "event"),
        priority=data.get("priority", "medium"),
        status=data.get("status", "pending")
    )
    db.session.add(new_event)
    db.session.commit()

    return jsonify({"success": True, "event": new_event.to_dict()}), 201

@app.route("/api/events/<int:event_id>", methods=["GET"])
@token_required
def get_event(current_user, event_id):
    event = Event.query.filter_by(id=event_id, user_id=current_user.id).first()
    if not event:
        return jsonify({"message": "Evento não encontrado"}), 404
    return jsonify({"success": True, "event": event.to_dict()})

@app.route("/api/events/<int:event_id>", methods=["PUT"])
@token_required
def update_event(current_user, event_id):
    event = Event.query.filter_by(id=event_id, user_id=current_user.id).first()
    if not event:
        return jsonify({"message": "Evento não encontrado"}), 404

    data = request.get_json()
    event.title = data.get("title", event.title)
    event.description = data.get("description", event.description)
    
    date_str = data.get("date")
    if date_str:
        try:
            event.date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "Formato de data inválido. Use YYYY-MM-DD"}), 400

    event.time = data.get("time", event.time)
    event.location = data.get("location", event.location)
    event.type = data.get("type", event.type)
    event.priority = data.get("priority", event.priority)
    event.status = data.get("status", event.status)

    db.session.commit()
    return jsonify({"success": True, "event": event.to_dict()})

@app.route("/api/events/<int:event_id>", methods=["DELETE"])
@token_required
def delete_event(current_user, event_id):
    event = Event.query.filter_by(id=event_id, user_id=current_user.id).first()
    if not event:
        return jsonify({"message": "Evento não encontrado"}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({"success": True, "message": "Evento deletado com sucesso"}), 200

@app.route("/api/events/search", methods=["GET"])
@token_required
def search_events(current_user):
    query_text = request.args.get("q", "")
    if not query_text:
        return jsonify({"success": True, "events": []})

    events = Event.query.filter(
        Event.user_id == current_user.id,
        (Event.title.ilike(f"%{query_text}%") | Event.description.ilike(f"%{query_text}%"))
    ).all()

    return jsonify({"success": True, "events": [event.to_dict() for event in events]})

@app.route("/api/user/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    return jsonify({"success": True, "user": current_user.to_dict()})

@app.route("/api/user/profile", methods=["PUT"])
@token_required
def update_profile(current_user):
    data = request.get_json()
    current_user.name = data.get("name", current_user.name)
    current_user.email = data.get("email", current_user.email)
    current_user.bio = data.get("bio", current_user.bio)
    current_user.phone = data.get("phone", current_user.phone)
    current_user.location = data.get("location", current_user.location)
    current_user.timezone = data.get("timezone", current_user.timezone)
    db.session.commit()
    return jsonify({"success": True, "message": "Perfil atualizado com sucesso", "user": current_user.to_dict()})


# --- Database Initialization ---
@app.before_request
def create_tables():
    db.create_all()

if __name__ == "__main__":
    with app.app_context():
        db.create_all() # Ensure tables are created when running locally
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)


