# import sqlite3
# conn = sqlite3.connect('jobs.db')
# conn.execute("ALTER TABLE jobs ADD COLUMN tags TEXT")
# conn.commit()
# conn.close()
# In a Python shell or script
from models import Base
from db import engine

Base.metadata.drop_all(engine)  # Be careful! This deletes all data.
Base.metadata.create_all(engine)
