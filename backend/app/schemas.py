# backend/app/schemas.py
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


# Product Schemas
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    original_price: Optional[float] = None
    category: str = Field(..., pattern="^(saree|ornament|bridal-set)$")
    sub_category: Optional[str] = None
    images: List[str] = Field(..., min_items=1)
    stock: int = Field(default=0, ge=0)
    featured: bool = False
    attributes: Optional[Dict[str, Any]] = None
    
    @validator('original_price')
    def validate_original_price(cls, v, values):
        if v is not None and 'price' in values and v <= values['price']:
            raise ValueError('original_price must be greater than price if provided')
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    original_price: Optional[float] = None
    category: Optional[str] = Field(None, pattern="^(saree|ornament|bridal-set)$")
    sub_category: Optional[str] = None
    images: Optional[List[str]] = None
    stock: Optional[int] = Field(None, ge=0)
    featured: Optional[bool] = None
    attributes: Optional[Dict[str, Any]] = None


class Product(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Order Item Schemas
class OrderItem(BaseModel):
    product_id: UUID
    product_name: str
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)
    attributes: Optional[Dict[str, str]] = None


# Order Schemas
class OrderBase(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_phone: str = Field(..., min_length=10, max_length=20)
    customer_email: Optional[EmailStr] = None
    customer_address: str = Field(..., min_length=1)
    customer_city: str = Field(..., min_length=1, max_length=100)
    customer_pincode: str = Field(..., min_length=6, max_length=10)
    items: List[OrderItem] = Field(..., min_items=1)
    total_amount: float = Field(..., gt=0)
    message: Optional[str] = None


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|confirmed|processing|shipped|delivered|cancelled)$")


# Response Schemas
class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int


class MessageResponse(BaseModel):
    message: str