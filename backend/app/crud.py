# backend/app/crud.py
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from . import models, schemas
import uuid


# Product CRUD Operations
def get_product(db: Session, product_id: str) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.id == uuid.UUID(product_id)).first()


def get_products(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None
) -> List[models.Product]:
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    
    if featured is not None:
        query = query.filter(models.Product.featured == featured)
    
    if search:
        query = query.filter(
            or_(
                models.Product.name.ilike(f"%{search}%"),
                models.Product.description.ilike(f"%{search}%"),
                models.Product.sub_category.ilike(f"%{search}%")
            )
        )
    
    return query.offset(skip).limit(limit).all()


def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        original_price=product.original_price,
        category=product.category,
        sub_category=product.sub_category,
        images=product.images,
        stock=product.stock,
        featured=product.featured,
        attributes=product.attributes
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: str, product_update: schemas.ProductUpdate) -> Optional[models.Product]:
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: str) -> bool:
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    
    db.delete(db_product)
    db.commit()
    return True


# Order CRUD Operations
def get_order(db: Session, order_id: str) -> Optional[models.Order]:
    return db.query(models.Order).filter(models.Order.id == uuid.UUID(order_id)).first()


def get_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
) -> List[models.Order]:
    query = db.query(models.Order)
    
    if status:
        query = query.filter(models.Order.status == status)
    
    return query.order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()


def create_order(db: Session, order: schemas.OrderCreate) -> models.Order:
    db_order = models.Order(
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        customer_email=order.customer_email,
        customer_address=order.customer_address,
        customer_city=order.customer_city,
        customer_pincode=order.customer_pincode,
        items=order.items,
        total_amount=order.total_amount,
        status="pending",
        message=order.message
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def update_order_status(db: Session, order_id: str, status: str) -> Optional[models.Order]:
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    
    db_order.status = status
    db.commit()
    db.refresh(db_order)
    return db_order