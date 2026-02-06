# backend/app/routers/upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
from pathlib import Path
from typing import List
import uuid
from datetime import datetime
from ..config import settings

router = APIRouter()


@router.post("/images")
async def upload_images(
    files: List[UploadFile] = File(...),
    category: str = "general"
):
    """
    Upload multiple images with categorization
    """
    try:
        # Create upload directory if not exists
        category_dir = Path(settings.upload_dir) / category
        category_dir.mkdir(parents=True, exist_ok=True)
        
        uploaded_files = []
        
        for file in files:
            # Validate file size
            file_size = 0
            temp_file = f"temp_{uuid.uuid4()}"
            with open(temp_file, "wb") as buffer:
                while chunk := await file.read(8192):
                    file_size += len(chunk)
                    if file_size > settings.max_upload_size:
                        os.remove(temp_file)
                        raise HTTPException(
                            status_code=400, 
                            detail=f"File {file.filename} exceeds {settings.max_upload_size // (1024*1024)}MB limit"
                        )
                    buffer.write(chunk)
            
            # Validate extension
            file_ext = Path(file.filename).suffix.lower()
            if file_ext not in settings.allowed_extensions:
                os.remove(temp_file)
                raise HTTPException(
                    status_code=400, 
                    detail=f"File type {file_ext} not allowed. Allowed types: {settings.allowed_extensions}"
                )
            
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = category_dir / unique_filename
            
            # Move temp file to final location
            shutil.move(temp_file, file_path)
            
            # Generate URL
            file_url = f"/uploads/{category}/{unique_filename}"
            
            uploaded_files.append({
                "original_name": file.filename,
                "filename": unique_filename,
                "url": file_url,
                "size": file_size,
                "category": category,
                "uploaded_at": datetime.now().isoformat()
            })
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"Successfully uploaded {len(uploaded_files)} files",
                "files": uploaded_files
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")