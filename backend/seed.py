from datetime import datetime, timedelta

from app.database import SessionLocal, Base, engine
from app.models import (
    Course,
    LeadSource,
    Counsellor,
    Lead,
    FollowUp,
)


Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed_data():

    # -------------------------
    # COURSES
    # -------------------------

    courses = [
        Course(
            name="B.Tech Computer Science",
            department="Engineering",
            fee=150000
        ),
        Course(
            name="BCA",
            department="Computer Applications",
            fee=90000
        ),
        Course(
            name="MCA",
            department="Computer Applications",
            fee=120000
        ),
        Course(
            name="MBA",
            department="Management",
            fee=140000
        ),
        Course(
            name="B.Sc Data Science",
            department="Data Science",
            fee=100000
        ),
        Course(
            name="B.Tech Artificial Intelligence & ML",
            department="Engineering",
            fee=160000
        ),
    ]

    db.add_all(courses)
    db.commit()


    # -------------------------
    # LEAD SOURCES
    # -------------------------

    sources = [
        LeadSource(name="Website"),
        LeadSource(name="Walk-in"),
        LeadSource(name="Phone"),
        LeadSource(name="WhatsApp"),
        LeadSource(name="Education Fair"),
        LeadSource(name="Referral"),
        LeadSource(name="Campaign"),
    ]

    db.add_all(sources)
    db.commit()


    # -------------------------
    # COUNSELLORS
    # -------------------------

    counsellors = [
        Counsellor(
            name="Rahul Sharma",
            email="rahul@example.com",
            phone="9876500001"
        ),
        Counsellor(
            name="Priya Kumar",
            email="priya@example.com",
            phone="9876500002"
        ),
        Counsellor(
            name="Arjun Singh",
            email="arjun@example.com",
            phone="9876500003"
        ),
        Counsellor(
            name="Sneha Raj",
            email="sneha@example.com",
            phone="9876500004"
        ),
    ]

    db.add_all(counsellors)
    db.commit()


    # -------------------------
    # SAMPLE LEADS
    # -------------------------

    leads = [
        Lead(
            student_name="Arun Kumar",
            phone="9876543210",
            email="arun@example.com",
            city="Bangalore",
            qualification="B.Tech",
            course_id=courses[0].id,
            source_id=sources[0].id,
            counsellor_id=counsellors[0].id,
            status="New",
            priority="High",
        ),

        Lead(
            student_name="Priya Sharma",
            phone="9876543211",
            email="priya.student@example.com",
            city="Chennai",
            qualification="12th",
            course_id=courses[1].id,
            source_id=sources[1].id,
            counsellor_id=counsellors[1].id,
            status="Contacted",
            priority="Medium",
        ),

        Lead(
            student_name="Karthik Raj",
            phone="9876543212",
            email="karthik@example.com",
            city="Bangalore",
            qualification="B.Sc",
            course_id=courses[4].id,
            source_id=sources[3].id,
            counsellor_id=counsellors[2].id,
            status="Interested",
            priority="High",
        ),

        Lead(
            student_name="Divya S",
            phone="9876543213",
            email="divya@example.com",
            city="Coimbatore",
            qualification="B.E",
            course_id=courses[5].id,
            source_id=sources[6].id,
            counsellor_id=counsellors[0].id,
            status="Follow-up",
            priority="High",
        ),

        Lead(
            student_name="Vignesh Kumar",
            phone="9876543214",
            email="vignesh@example.com",
            city="Madurai",
            qualification="B.Com",
            course_id=courses[3].id,
            source_id=sources[5].id,
            counsellor_id=counsellors[1].id,
            status="Application Started",
            priority="Medium",
        ),

        Lead(
            student_name="Meena Priya",
            phone="9876543215",
            email="meena@example.com",
            city="Bangalore",
            qualification="BCA",
            course_id=courses[2].id,
            source_id=sources[0].id,
            counsellor_id=counsellors[3].id,
            status="Converted",
            priority="High",
        ),

        Lead(
            student_name="Sanjay Kumar",
            phone="9876543216",
            email="sanjay@example.com",
            city="Hyderabad",
            qualification="B.Tech",
            course_id=courses[0].id,
            source_id=sources[4].id,
            counsellor_id=counsellors[2].id,
            status="Qualified",
            priority="Medium",
        ),

        Lead(
            student_name="Nandhini R",
            phone="9876543217",
            email="nandhini@example.com",
            city="Bangalore",
            qualification="12th",
            course_id=courses[5].id,
            source_id=sources[3].id,
            counsellor_id=counsellors[3].id,
            status="Interested",
            priority="High",
        ),

        Lead(
            student_name="Mohammed Faisal",
            phone="9876543218",
            email="faisal@example.com",
            city="Mysore",
            qualification="BBA",
            course_id=courses[3].id,
            source_id=sources[2].id,
            counsellor_id=counsellors[0].id,
            status="Lost",
            priority="Low",
        ),

        Lead(
            student_name="Harish Kumar",
            phone="9876543219",
            email="harish@example.com",
            city="Bangalore",
            qualification="B.Sc",
            course_id=courses[4].id,
            source_id=sources[0].id,
            counsellor_id=counsellors[1].id,
            status="Application Submitted",
            priority="High",
        ),
    ]

    db.add_all(leads)
    db.commit()


    print("Seed data inserted successfully!")


try:
    seed_data()

finally:
    db.close()