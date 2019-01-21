# Introduction

`trt-waste-lookup` is a web app to search for waste items using the Toronto Waste Wizard database

Please try [Hosted version](https://trt-waste-lookup.herokuapp.com/)

## Design

client
  - [x] fetch request only receive necessary data from express server
  - [x] favourites data should store locally
  - [x] mobile devices support

server
  - [x] retrieve lookup data on start
  - [ ] update json data periodically
  - [x] handle request from client, lookup for the query string based on keywords
    - we can process the keywords list further, like replacing spaces with empty string to expand the potential match. Therefore 'take out' could be matched by 'takeout'
  - [x] send lookup results to client
