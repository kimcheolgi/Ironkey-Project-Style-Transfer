from fastapi import Request, APIRouter, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.library.helpers import *
from app.library.style_transfer import save_style_transfer_image

import shutil
from pydantic.main import BaseModel

router = APIRouter()
templates = Jinja2Templates(directory="templates/")


@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    data = openfile("home.md")
    return templates.TemplateResponse("page.html", {"request": request, "data": data})


class UploadedData(BaseModel):
    img_path: str
    thumb_path: str


@router.post("/upload/new/", response_model=UploadedData)
async def post_upload(imgdata: tuple, file: UploadFile = File(...)):
    data_dict = eval(imgdata[0])
    winWidth, imgWidth, imgHeight = data_dict["winWidth"], data_dict["imgWidth"], data_dict["imgHeight"]

    # create the full path
    workspace = create_workspace()
    # filename
    file_path = Path(file.filename)
    # image full path
    img_full_path = workspace / file_path
    with open(str(img_full_path), 'wb') as myfile:
        contents = await file.read()
        myfile.write(contents)
    # create a thumb image and save it
    thumb(img_full_path, winWidth, imgWidth, imgHeight)
    # create the thumb path
    # ext is like .png or .jpg
    filepath, ext = os.path.splitext(img_full_path)
    thumb_path = filepath + ".thumbnail"+ext

    return UploadedData(
        img_path=str(img_full_path),
        thumb_path=str(thumb_path)
    )


class TransferData(BaseModel):
    result: str


@router.get("/style_transfer", response_model=TransferData)
async def style_transfer(original_path: str, style_path: str):
    transfer_path = save_style_transfer_image(content_path=original_path, style_path=style_path)
    shutil.rmtree(original_path.replace(original_path.split('/')[-1], ''))
    shutil.rmtree(style_path.replace(style_path.split('/')[-1], ''))

    return TransferData(result=str(transfer_path))
