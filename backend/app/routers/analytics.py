# backend/app/routers/analytics.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case
from datetime import datetime, timedelta
from typing import Dict, Any
from ..database import get_db
from .. import models

router = APIRouter()

@router.get("/dashboard-stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get overall dashboard statistics"""
    
    # Total products
    total_products = db.query(func.count(models.Product.id)).scalar()
    
    # Total orders
    total_orders = db.query(func.count(models.Order.id)).scalar()
    
    # Total revenue
    total_revenue = db.query(func.sum(models.Order.total_amount)).scalar() or 0
    
    # Today's orders
    today = datetime.now().date()
    today_orders = db.query(func.count(models.Order.id))\
        .filter(func.date(models.Order.created_at) == today)\
        .scalar()
    
    # Low stock products
    low_stock = db.query(func.count(models.Product.id))\
        .filter(models.Product.stock < 10)\
        .scalar()
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "today_orders": today_orders,
        "low_stock_products": low_stock
    }

@router.get("/sales-analytics")
async def get_sales_analytics(
    period: str = "month",  # day, week, month, year
    db: Session = Depends(get_db)
):
    """Get sales analytics for charts"""
    
    end_date = datetime.now()
    
    if period == "day":
        start_date = end_date - timedelta(days=1)
        interval = "hour"
    elif period == "week":
        start_date = end_date - timedelta(days=7)
        interval = "day"
    elif period == "month":
        start_date = end_date - timedelta(days=30)
        interval = "day"
    else:  # year
        start_date = end_date - timedelta(days=365)
        interval = "month"
    
    # Get orders in period
    orders = db.query(
        func.date_trunc(interval, models.Order.created_at).label('period'),
        func.count(models.Order.id).label('orders'),
        func.sum(models.Order.total_amount).label('revenue')
    )\
    .filter(models.Order.created_at.between(start_date, end_date))\
    .group_by('period')\
    .order_by('period')\
    .all()
    
    # Get top selling products
    top_products = db.query(
        models.Product.name,
        func.count(models.Order.id).label('sales')
    )\
    .join(models.Order, models.Order.items.contains(models.Product.id))\
    .group_by(models.Product.id, models.Product.name)\
    .order_by(func.count(models.Order.id).desc())\
    .limit(10)\
    .all()
    
    return {
        "sales_data": [
            {
                "period": order.period.isoformat(),
                "orders": order.orders,
                "revenue": float(order.revenue or 0)
            }
            for order in orders
        ],
        "top_products": [
            {"name": product.name, "sales": product.sales}
            for product in top_products
        ]
    }

@router.get("/category-analytics")
async def get_category_analytics(db: Session = Depends(get_db)):
    """Get analytics by product category"""
    
    # Products by category
    products_by_category = db.query(
        models.Product.category,
        func.count(models.Product.id).label('count'),
        func.avg(models.Product.price).label('avg_price')
    )\
    .group_by(models.Product.category)\
    .all()
    
    # Sales by category
    sales_by_category = db.query(
        models.Product.category,
        func.count(models.Order.id).label('sales'),
        func.sum(models.Order.total_amount).label('revenue')
    )\
    .join(models.Order, models.Order.items.contains(models.Product.id))\
    .group_by(models.Product.category)\
    .all()
    
    return {
        "products_by_category": [
            {
                "category": item.category,
                "count": item.count,
                "avg_price": float(item.avg_price or 0)
            }
            for item in products_by_category
        ],
        "sales_by_category": [
            {
                "category": sale.category,
                "sales": sale.sales,
                "revenue": float(sale.revenue or 0)
            }
            for sale in sales_by_category
        ]
    }