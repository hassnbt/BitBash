from flask import Flask, jsonify, request
from flask_cors import CORS
from db import Session
from models import Job
import threading
import schedualer    # Import the scheduler module
import os
from datetime import datetime
from werkzeug.utils import secure_filename
app = Flask(__name__)
CORS(app)


def run_scheduler():
    schedualer.run_scheduler_loop()  

scheduler_thread = threading.Thread(target=run_scheduler)
scheduler_thread.daemon = True
scheduler_thread.start()

# ------------------------
# API Routes
# ------------------------
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

jobs = []  # Or replace with DB logic

@app.route('/api/jobs', methods=['POST'])
def add_job():
    data = request.form
    image = request.files.get('image')
    print(data)
    image_url = ''
    if image:
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
        image_url = f'/static/uploads/{filename}'

    try:
        posted_date_str = data.get('posted_date', '2024-01-01')
        posted_date = datetime.strptime(posted_date_str, '%Y-%m-%d')

        new_job = Job(
            title=data.get('title'),
            company=data.get('description'),
            location=data.get('location'),
            keywords=data.get('keywords'),
            sector=data.get('sector'),
            experience=data.get('experience'),
            posted_date=datetime.utcnow(),
            image_link=image_url  # Ensure this matches the field name in your model
        )

        session = Session()
        session.add(new_job)
        session.commit()

        return jsonify({
            'id': new_job.id,
            'title': new_job.title,
            'company': new_job.company,
            'location': new_job.location,
            'keywords': new_job.keywords,
            'sector': new_job.sector,
            'experience': new_job.experience,
            'posted_date': new_job.posted_date.isoformat(),
            'image_link': new_job.image_link  # match what frontend expects
        }), 201

    except Exception as e:
        print("Error saving job:", e)
        return jsonify({'error': 'Failed to add job'}), 500

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    session = Session()
    jobs = session.query(Job).all()
    session.close()

    return jsonify([{
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "sector": job.sector,
        "experience": job.experience,
        "keywords": job.keywords,
        "image_link": job.image_link,
        "link": job.link,
        "posted_date": job.posted_date
    } for job in jobs])

@app.route('/api/jobs/<int:id>', methods=['DELETE'])
def delete_job(id):
    session = Session()
    job = session.query(Job).filter(Job.id == id).first()

    if not job:
        session.close()
        return jsonify({"error": "Job not found"}), 404

    session.delete(job)
    session.commit()
    session.close()

    return jsonify({"message": "Job deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
