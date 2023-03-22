from flask import current_app, request
from app import db
from app.models import Song
from botocore.exceptions import ClientError
import uuid
import os

ALLOWED_EXTENSIONS = {'mp3'}
load_dotenv()
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_to_b2(file):
    try:
        response = b2.upload_file(
            Bucket=os.getenv("bucket_name"),
            Key=uuid.uuid4().hex + '.mp3',
            Body=file,
            ContentType='audio/mpeg'
        )
        return response['Location']
    except ClientError as e:
        print(e)
        return None



def upload_file(bucket, directory, file, b2, b2path=None):
    file_path = directory + '/' + file
    remote_path = b2path
    if remote_path is None:
        remote_path = file
    try:
        response = b2.Bucket(bucket).upload_file(file_path, remote_path)
    except ClientError as ce:
        print('error', ce)

    return response