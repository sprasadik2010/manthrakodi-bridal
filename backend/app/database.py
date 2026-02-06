# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

print(f"🔗 Connecting to database: {settings.DATABASE_URL}")

try:
    engine = create_engine(settings.DATABASE_URL)
    # Test connection
    with engine.connect() as conn:
        print("✅ Database connection successful!")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("Please check your PostgreSQL credentials and make sure:")
    print("1. PostgreSQL service is running")
    print("2. User 'mkb-db-user' exists")
    print("3. Database 'mkb-db' exists")
    print("4. User has access to the database")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()