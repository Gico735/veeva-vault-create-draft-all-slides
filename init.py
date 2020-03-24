#!/usr/bin/env python
from sys import argv
import requests
import json

script, server, id_pres, token = argv
curl_adress ='https://'+server+'.veevavault.com/api/v19.3/'
token = 'Bearer '+token

response = requests.get(curl_adress+'objects/binders/'+id_pres, headers={"Authorization":token})
slides_dict = (json.loads(response.content))['binder']['nodes']

for slide in slides_dict:
    slide_id =slide['properties']['document_id__v']
    # major, minor = (json.loads(requests.get(curl_adress+'/objects/documents/'+str(slide_id)+'/versions/',headers={"Authorization":token}).content))['versions'][-1]['number'].split('.')
    # print(slide_id,':', major, minor)
    slide_res = requests.post(curl_adress+'/objects/documents/'+str(slide_id),headers={"Authorization":token,"Content-Type":'multipart/form-data'},data={'createDraft': 'latestContent'},files={'createDraft': 'latestContent'}).content
    print(slide_res)

