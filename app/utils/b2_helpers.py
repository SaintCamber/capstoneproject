import botocore
import boto3  # REQUIRED! - Details here: https://pypi.org/project/boto3/
from botocore.exceptions import ClientError
from botocore.config import Config
# from dotenv import load_dotenv  # Project Must install Python Package:  python-dotenv
import sys
import os
import uuid
import requests
import base64
import json

BUCKET_NAME = os.environ.get("bucket_name")
B2_LOCATION ="https://s3.us-east-005.backblazeb2.com"
ALLOWED_EXTENSIONS = {"mp3","wav","flac"}


b2_client = boto3.client(
   "s3",
   endpoint_url=os.environ.get("B2_LOCATIOn"),
   aws_access_key_id=os.environ.get("B2_KEY"),
   aws_secret_access_key=os.environ.get("B2_SECRET"),
   config=Config(signature_version='s3v4'),
   )

#  Return a boto3 resource object for B2 service
def get_b2_resource(endpoint, key_id, application_key):
    b2 = boto3.resource(service_name='s3',
                           endpoint_url=os.environ.get("B2_LOCATIOn"),# Backblaze endpoint
    aws_access_key_id=os.environ.get("B2_KEY"),
    aws_secret_access_key=os.environ.get("B2_SECRET"),   # Backblaze keyID    
                                                        # Backblaze applicationKey
                          
                                                   
                        )
    return b2


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
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        # in case the our b2 upload fails
        return {"errors": str(e)}

    return {"url": f"{B2_LOCATION}/{BUCKET_NAME}/{unique_filename}"}

def upload_to_b2(fileobj, bucket_name, key_name):
    b2 = boto3.client('s3',
                      endpoint_url="https://s3.us-east-005.backblazeb2.com",
                      aws_access_key_id=os.getenv("B2_KEY"),
                      aws_secret_access_key=os.getenv("B2_SECRET"),
                      config=Config(signature_version='s3v4'))
    url = b2.upload_fileobj(fileobj, bucket_name, key_name)
    return {"url":url}

    
def get_upload_url(api_url,account_authorization_token,bucket_id):
    
    
    headers = {'Authorization': account_authorization_token}
    data = {'bucketId': bucket_id}
    response = requests.post(f'{api_url}/b2api/v2/b2_get_upload_url', headers=headers, json=data)

    if response.status_code != 200:
        return jsonify({'error': 'Failed to get upload URL'})

    response_data = response.json()
    return {'uploadUrl': response_data['uploadUrl'], 'authorizationToken': response_data['authorizationToken']}





def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def authorize_account(account_id=os.getenv('account_id'),application_key_id=os.getenv("B2_KEY"),application_key=os.getenv("B2_SECRET")):
    
    id_and_key = f'{os.getenv("b2_key")}:{os.getenv("B2_SECRET")}'
    id_and_key_bytes = id_and_key.encode("utf-8")
    basic_auth_string = f"Basic  {base64.b64encode(id_and_key_bytes)}"
    headers = {'Authorization':basic_auth_string }
    data = {'accountId': account_id}
    response = requests.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', headers=headers, json=data)

    if response.status_code != 200:
        return {'error': 'Failed to authorize account'}

    response_data = {response}
    return {'authorizationToken': response_data['authorizationToken'], 'apiUrl': response_data['apiUrl']}


print(authorize_account())

def list_buckets(b2_client, raw_object=False):
    try:
        my_buckets_response = b2_client.list_buckets()

        print('\nBUCKETS')
        for bucket_object in my_buckets_response[ 'Buckets' ]:
            print(bucket_object[ 'Name' ])

        if raw_object:
            print('\nFULL RAW RESPONSE:')
            print(my_buckets_response)

    except ClientError as ce:
        print('error', ce)


