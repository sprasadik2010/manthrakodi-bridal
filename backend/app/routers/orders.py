# backend/app/routers/orders.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Order])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db)
):
    """
    Get orders with optional status filter
    """
    orders = crud.get_orders(db, skip=skip, limit=limit, status=status)
    return orders


@router.get("/{order_id}", response_model=schemas.Order)
def read_order(order_id: str, db: Session = Depends(get_db)):
    """
    Get a specific order by ID
    """
    order = crud.get_order(db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new order
    """
    return crud.create_order(db=db, order=order)


@router.put("/{order_id}/status", response_model=schemas.Order)
def update_order_status(
    order_id: str, 
    status_update: schemas.OrderStatusUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update order status
    """
    order = crud.update_order_status(db, order_id=order_id, status=status_update.status)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order