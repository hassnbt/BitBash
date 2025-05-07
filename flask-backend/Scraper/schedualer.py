import schedule
import time
from scrper import scrape_jobs
import logging

# Setup logging
logging.basicConfig(filename='scheduler.log', level=logging.INFO)

# Define the job schedule
schedule.every(1).minutes.do(scrape_jobs)

def run_scheduler_loop():
    logging.info("Scheduler started")
    while True:
        schedule.run_pending()
        time.sleep(1)

# Only run loop if script is directly run
if __name__ == "__main__":
    run_scheduler_loop()
