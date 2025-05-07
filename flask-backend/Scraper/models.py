from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Job(Base):
    __tablename__ = 'jobs'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    location = Column(String)
    company = Column(String,nullable=True)
    sector = Column(String)
    experience = Column(String)
    keywords = Column(String)
    image_link = Column(String)
    link = Column(String,nullable=True)
    posted_date = Column(DateTime, default=datetime.utcnow)  # New field for posted date
