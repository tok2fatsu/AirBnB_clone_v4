#!/usr/bin/python3
""" Starts a Flash Web Application """
import uuid

from flask import Flask, render_template

from models import storage
from models.amenity import Amenity
from models.place import Place
from models.state import State

app = Flask(__name__)


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/4-hbnb', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = list(storage.all(State).values())
    amenities = list(storage.all(Amenity).values())
    places = list(storage.all(Place).values())

    return render_template(
        '4-hbnb.html',
        states=states,
        amenities=amenities,
        places=places,
        cache_id=uuid.uuid4(),
    )


if __name__ == "__main__":
    """ Main Function """
    app.run(debug=True)
