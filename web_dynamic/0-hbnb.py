#!/usr/bin/python3
"""Starts a Flask web application.
The application listens on 0.0.0.0, port 5000.
Routes:
    /hbnb: HBnB home page.
"""
import uuid

from flask import Flask, render_template

from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place


app = Flask(__name__)


@app.teardown_appcontext
def clode_db(error):
    """Remove the current SQLAlchemy session."""
    storage.close()


@app.route("/0-hbnb", strict_slashes=False)
def hbnb():
    """Displays the main HBnB filters HTML page."""
    states = list(storage.all(State).values())
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = list(storage.all("Amenity").values())
    amenities = sorted(amenities, key=lambda k: k.name)

    places = list(storage.all("Place").values())
    places = sorted(places, key=lambda k: k.name)

    return render_template(
        "0-hbnb.html",
        states=st_ct,
        amenities=amenities,
        places=places,
    )


if __name__ == "__main__":
    """ Main Fun """
    app.run()
