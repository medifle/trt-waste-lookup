# Introduction

`trt-waste-lookup` is a web app to search for waste items using the Toronto Waste Wizard database

## Design

client
  - fetch request only receive necessary data from express server

server
  - retrieve lookup data on start
  - update json data periodically
  - handle request from client, lookup for the query string based on keywords (we can process the keywords list further, like replacing spaces with empty string to expand the potential match. Therefore 'take out' could be matched by 'takeout')
  - send lookup results to client
  - favourites data should store locally
