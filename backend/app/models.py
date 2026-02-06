# backend/app/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.sql import func
import uuid
from .database import Base
from datetime import datetime


class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    original_price = Column(Float)
    category = Column(String(50), nullable=False)  # saree, ornament, bridal-set
    sub_category = Column(String(100))
    images = Column(ARRAY(String), nullable=False)
    stock = Column(Integer, default=0)
    featured = Column(Boolean, default=False)
    attributes = Column(JSONB)  # material, color, work, weight, occasion
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(255))
    customer_address = Column(Text, nullable=False)
    customer_city = Column(String(100), nullable=False)
    customer_pincode = Column(String(10), nullable=False)
    items = Column(JSONB, nullable=False)  # Store cart items as JSON
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending")  # pending, confirmed, shipped, delivered
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)