import boto3
from botocore.exceptions import ClientError
import json
import logging
import os
import uuid
import base64
import requests
from flask import jsonify

BUCKET_NAME = os.environ.get("bucket_name")
B2_LOCATION = "https://s3.us-east-005.backblazeb2.com"
ALLOWED_EXTENSIONS = {"mp3", "wav", "flac"}

b2_client = boto3.client(
    "s3",
    endpoint_url=os.environ.get("s3_api_url"),
    aws_access_key_id=os.environ.get("B2_KEY"),
    aws_secret_access_key=os.environ.get("B2_SECRET"),
)


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


def upload_file_to_b2(file, acl="public-read"):
    try:
        # Generate a unique filename for the uploaded file
        unique_filename = get_unique_filename(file.filename)

        # Upload the file using upload_fileobj
        b2_client.upload_fileobj(
            file.stream,
            BUCKET_NAME,
            unique_filename,
            ExtraArgs={"ACL": acl, "ContentType": file.content_type},
        )
    except Exception as e:
        # in case the our b2 upload fails
        return {"errors": str(e)}

    return {"url": f"{B2_LOCATION}/{BUCKET_NAME}/{unique_filename}"}


def get_upload_url(
    s3_api_url=os.environ.get("s3_api_url"),
    account_authorization_token=os.environ.get("account_authorization_token"),
    bucket_id=os.environ.get("bucketId"),
):
    headers = {"Authorization": account_authorization_token}
    data = {"bucketId": bucket_id}
    response = requests.post(
        f"{s3_api_url}/b2api/v2/b2_get_upload_url", headers=headers, json=data
    )

    if response.status_code != 200:
        return jsonify({"error": "Failed to get upload URL"})

    response_data = response.json()
    return {
        "uploadUrl": response_data["uploadUrl"],
        "authorizationToken": response_data["authorizationToken"],
    }


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
