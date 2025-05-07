from sqlalchemy.orm import sessionmaker
from models import Job, Base
from sqlalchemy import create_engine

engine = create_engine("sqlite:///jobs.db")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)