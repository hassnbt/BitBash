from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Job, Base
from datetime import datetime, timedelta
import logging
import re

# Setup logging
logging.basicConfig(filename='scraper.log', level=logging.INFO)

def parse_relative_date(relative_str):
    """
    Converts relative date like '9h ago' or '2d ago' to an absolute datetime.
    """
    match = re.match(r"(\d+)([hd])", relative_str)
    if match:
        value, unit = match.groups()
        value = int(value)
        if unit == 'h':
            return datetime.now() - timedelta(hours=value)
        elif unit == 'd':
            return datetime.now() - timedelta(days=value)
    return datetime.now()  # default fallback

def scrape_jobs():
    logging.info("Scraping started")

    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")

    # Chrome Driver Path
    driver_path = r"C:\Windows\chromedriver.exe"
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Setup Database
    engine = create_engine('sqlite:///jobs.db')
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        driver.get("https://www.actuarylist.com/")
        wait = WebDriverWait(driver, 15)
        jobs_elements = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "Job_job-card__YgDAV")))

        for job in jobs_elements:
            try:
                title = job.find_element(By.CLASS_NAME, "Job_job-card__position__ic1rc").text
                company = job.find_element(By.CLASS_NAME, "Job_job-card__company__7T9qY").text
                link = job.find_element(By.CLASS_NAME, "Job_job-page-link__a5I5g").get_attribute("href")

                # Get all tags
                all_tags = job.find_elements(By.CLASS_NAME, "Job_job-card__location__bq7jX")

                locations = [tag.text.strip() for tag in all_tags if "/cities/" in tag.get_attribute("href") or "/countries/" in tag.get_attribute("href")]
                sectors = [tag.text.strip() for tag in all_tags if "/sectors/" in tag.get_attribute("href")]
                experience_levels = [tag.text.strip() for tag in all_tags if "/experience-levels/" in tag.get_attribute("href")]
                keywords = [tag.text.strip() for tag in all_tags if "/keywords/" in tag.get_attribute("href")]

                location = ', '.join(filter(None, locations))
                sector_str = ', '.join(filter(None, sectors))
                experience_str = ', '.join(filter(None, experience_levels))
                keywords_str = ', '.join(filter(None, keywords))

                # Extract image
                try:
                    image_elem = job.find_element(By.CSS_SELECTOR, ".Job_job-card__logo__cdF2_ img")
                    image_link = image_elem.get_attribute("src")
                except:
                    image_link = ""

                # Extract posted date
                try:
                    posted_date_elem = job.find_element(By.CLASS_NAME, "Job_job-card__posted-on__NCZaJ")
                    posted_date_str = posted_date_elem.text.strip()
                    posted_date = parse_relative_date(posted_date_str)
                except:
                    posted_date = datetime.now()

                # Check for duplicate job (based on job link)
                existing_job = session.query(Job).filter_by(link=link).first()
                if existing_job:
                    print(f"\n--- Job Already Exists ---\nLink: {link}")
                    continue

                # Create and store job
                job_entry = Job(
                    title=title,
                    company=company,
                    location=location,
                    sector=sector_str,
                    experience=experience_str,
                    keywords=keywords_str,
                    image_link=image_link,
                    link=link,
                    posted_date=posted_date
                )
                session.add(job_entry)
                session.commit()

                print("\n--- Job Stored ---")
                print(f"Title: {title}")
                print(f"Company: {company}")
                print(f"Location: {location}")
                print(f"Link: {link}")
                print(f"Sectors: {sector_str}")
                print(f"Experience: {experience_str}")
                print(f"Keywords: {keywords_str}")
                print(f"Image: {image_link}")
                print(f"Posted Date: {posted_date}")

            except Exception as e:
                logging.error(f"Error extracting a job: {e}")
                print(f"Error extracting a job: {e}")

        logging.info("Scraping complete.")

    except Exception as e:
        logging.error(f"Error during scraping: {e}")
        print(f"Error during scraping: {e}")

    finally:
        session.close()
        driver.quit()

if __name__ == "__main__":
    scrape_jobs()
