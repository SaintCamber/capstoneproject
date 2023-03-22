import boto3  # REQUIRED! - Details here: https://pypi.org/project/boto3/
from botocore.exceptions import ClientError
from flask import request,current_app
from botocore.config import Config
from dotenv import load_dotenv  # Project Must install Python Package:  python-dotenv
import os
import sys
import uuid
import urllib3
import json

load_dotenv()

http = urllib3.PoolManager()

endpoint = os.getenv('ENDPOINT') 

keyID = os.getenv('B2_KEY_ID')

applicationKey = os.getenv('B2_APPLICATION_KEY') 
BUCKET_NAME = os.getenv("B2_BUCKET_NAME")

# Return a boto3 resource object for B2 service
def get_b2_resource(endpoint, key_id, application_key):
    b2 = boto3.resource(service_name='s3',
                        endpoint_url=endpoint,                # Backblaze endpoint
                        aws_access_key_id=keyID,              # Backblaze keyID
                        aws_secret_access_key=applicationKey, # Backblaze applicationKey
                        config = Config(
                            signature_version='s3v4',
                    ))
    return b2

def get_b2_client(endpoint, key_id, application_key):
    client = boto3.client(service_name='s3',
                          endpoint_url=endpoint,
                          aws_access_key_id=keyID,
                          aws_secret_access_key=applicationKey)
    # pyboto3 provides Pythonic Interface for typehint for autocomplete in pycharm
    # """ :type : pyboto3.s3 """
    return client

def list_object_keys(bucket, b2):
    try:
        response = b2.Bucket(bucket).objects.all()

        return_list = []               # create empty list
        for object in response:        # iterate over response
            return_list.append(object.key) # for each item in response,
                                       # append object.key to list   
        return return_list             # return list of keys from response 

    except ClientError as ce:
        print('error', ce)


b2 = get_b2_resource(endpoint,keyID,applicationKey)
client = get_b2_client(endpoint,keyID,applicationKey)

# bucket_object_keys = list_object_keys(BUCKET_NAME, b2)

# print(bucket_object_keys)



api_url = "https://s3.us-east-005.backblazeb2.com" # Provided by b2_authorize_account
account_authorization_token = "4_00534b8d3672e7b0000000002_01ab1eae_583bea_acct_rc2zTUqtk1ZgynlFm7z0rLBMCnI=" # Provided by b2_authorize_account
bucketId = "d3343b682d83f677826e071b" # The ID of the bucket you want to upload your file to

# r = http.request(
#     'GET',
#     'http://httpbin.org/headers',
#     headers={
#         'X-Something': 'value'
#     }
# )
# def list_buckets(b2_client, raw_object=False):
#     try:
#         my_buckets_response = b2_client.list_buckets()

#         print('\nBUCKETS')
#         for bucket_object in my_buckets_response[ 'Buckets' ]:
#             print(bucket_object[ 'Name' ])

#         if raw_object:
#             print('\nFULL RAW RESPONSE:')
#             print(my_buckets_response)

#     except ClientError as ce:
#         print('error', ce)

# list_buckets(client) 

# with open(r"yeet.PNG","r") as f:
#     read_data = f.read()
    
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

# upload_file("capstonestorage",".","yeet.PNG" ,b2)