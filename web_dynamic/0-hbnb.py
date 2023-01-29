#!/usr/bin/python3
"""Starts a Flask web application.
The application listens on 0.0.0.0, port 5000.
Routes:
    /hbnb: HBnB home page.
"""
from flask import Flask, render_template

from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place


app = Flask(__name__)


@app.teardown_appcontext
def teardown(self):
    """Remove the current SQLAlchemy session."""
    storage.close()


@app.route("/hbnb", strict_slashes=False)
def hbnb():
    """Displays the main HBnB filters HTML page."""
    states = list(storage.all(State).values())
    amenities = list(storage.all("Amenity").values())
    places = list(storage.all("Place").values())
    return render_template(
        "0-hbnb.html",
        states=states,
        amenities=amenities,
        places=places,
    )


if __name__ == "__main__":
    storage.reload()
    app.run(host="0.0.0.0", 5000)
