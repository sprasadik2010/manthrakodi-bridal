from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..database import get_db
import requests
from urllib.parse import urlparse
import uuid

router = APIRouter()


# IMPORTANT: SPECIFIC ROUTES MUST COME BEFORE GENERIC {product_id} ROUTE

# @router.get("/search/", response_model=List[schemas.Product])
# def search_products(
#     q: str = Query(..., min_length=1, description="Search by product name, description, or sub-category"),
#     skip: int = 0,
#     limit: int = 100,
#     category: Optional[str] = None,  # NO PATTERN HERE - completely optional
#     featured: Optional[bool] = None,
#     db: Session = Depends(get_db)
# ):
#     """
#     Search products by name, description, or sub-category
#     """
#     products = crud.get_products(
#         db, 
#         skip=skip, 
#         limit=limit, 
#         category=category,  # Will be None if not provided
#         featured=featured,
#         search=q
#     )
#     return products

@router.get("/search/", response_model=List[schemas.Product])
def search_products(
    q: str = Query(..., min_length=1, description="Search by product name, description, or sub-category"),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Search products by name, description, or sub-category
    """
    print(f"DEBUG - Search called with: q={q}, category={category}, featured={featured}, skip={skip}, limit={limit}")
    
    products = crud.get_products(
        db, 
        skip=skip, 
        limit=limit, 
        category=category, 
        featured=featured,
        search=q
    )
    
    print(f"DEBUG - Found {len(products)} products")
    return products



@router.get("/", response_model=List[schemas.Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None, description="Filter by category (saree, ornament, bridal-set)"),
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get products with optional filtering
    """
    products = crud.get_products(
        db, 
        skip=skip, 
        limit=limit, 
        category=category, 
        featured=featured,
        search=search
    )
    return products


@router.get("/{product_id}", response_model=schemas.Product)
def read_product(product_id: str, db: Session = Depends(get_db)):
    """
    Get a specific product by its UUID
    """
    try:
        uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid product ID format. Must be a valid UUID, got: '{product_id}'"
        )
    
    product = crud.get_product(db, product_id=product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product
    """
    return crud.create_product(db=db, product=product)


@router.put("/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: str, 
    product_update: schemas.ProductUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update a product by ID
    """
    try:
        uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid product ID format. Must be a valid UUID, got: '{product_id}'"
        )
    
    product = crud.update_product(db, product_id=product_id, product_update=product_update)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    """
    Delete a product by ID
    """
    try:
        uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid product ID format. Must be a valid UUID, got: '{product_id}'"
        )
    
    success = crud.delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


def validate_image_url(url: str) -> bool:
    """Validate if URL points to an actual image"""
    try:
        parsed = urlparse(url)
        if not parsed.scheme in ['http', 'https']:
            return False
        
        allowed_domains = [
            'i.ibb.co', 'ibb.co', 'imgbb.com',
            'postimg.cc', 'postimages.org',
            'freeimage.host', 'iili.io',
            'cdn.discordapp.com',
            'fbcdn.net', 'facebook.com'
        ]
        
        if not any(domain in parsed.netloc for domain in allowed_domains):
            return False
        
        valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        if not any(parsed.path.lower().endswith(ext) for ext in valid_extensions):
            return False
        
        return True
    except:
        return False


@router.post("/validate-images")
async def validate_images(urls: List[str]):
    """Validate multiple image URLs"""
    validated_urls = []
    invalid_urls = []
    
    for url in urls:
        if validate_image_url(url):
            validated_urls.append(url)
        else:
            invalid_urls.append(url)
    
    return {
        "valid": validated_urls,
        "invalid": invalid_urls,
        "message": f"Found {len(validated_urls)} valid and {len(invalid_urls)} invalid URLs"
    }