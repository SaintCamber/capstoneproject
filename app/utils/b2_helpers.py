import os
import uuid
import base64
import requests
import b2sdk
from flask import jsonify
from werkzeug.utils import secure_filename
import boto3
from botocore.exceptions import ClientError

BUCKET_NAME = os.environ.get("BUCKET_NAME")
ALLOWED_EXTENSIONS = {"mp3", "wav", "flac"}

b2_client = boto3.client(
    "s3",
    endpoint_url=os.environ.get("S3_API_URL"),
    aws_access_key_id=os.environ.get("B2_KEY"),
    aws_secret_access_key=os.environ.get("B2_SECRET"),
)


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


def upload_file_to_b2(file, acl="public-read"):
    try:
        # Secure the filename to prevent directory traversal attacks
        filename = secure_filename(file.filename)

        # Generate a unique filename for the uploaded file
        unique_filename = get_unique_filename(filename)

        # Upload the file using put_object
        b2_client.put_object(
            Body=file.read(),
            Bucket=BUCKET_NAME,
            Key=unique_filename,
            ACL=acl,
            ContentType=file.content_type,
        )

    except ClientError as e:
        # in case the our b2 upload fails
        return {"errors": str(e)}

    return {"url": f"{BUCKET_NAME}/{unique_filename}"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def authorize_account(
    account_id=os.environ.get("account_id"),
    application_key_id=os.environ.get("B2_KEY"),
    application_key=os.environ.get("B2_SECRET"),
):
    id_and_key = f'{os.environ.get("B2_KEY")}:{os.environ.get("B2_SECRET")}'
    id_and_key_bytes = id_and_key.encode("utf-8")
    basic_auth_string = f"Basic {base64.b64encode(id_and_key_bytes).decode('utf-8')}"
    headers = {"Authorization": basic_auth_string}
    data = {"accountId": account_id}
    response = requests.get(
        "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        headers=headers,
        json=data,
    )

    if response.status_code != 200:
        return {"error": "Failed to authorize account"}

    response_data = response.json()
    return {
        "authorizationToken": response_data["authorizationToken"],
        "apiUrl": response_data["apiUrl"],
    }
