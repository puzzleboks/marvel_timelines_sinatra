![alt text](marvel_screenshot3.png "Description goes here")

# Marvel Timelines

## Project

A simple application that interacts with the Marvel API. Search for your favorite Marvel superhero and it will return, in ascending order by date, a timeline of major events in which that particular character appears. Click on the buttons for images of the event.

## Technologies

#### Front-end
* HTML5/CSS3
* JavaScript/jQuery/AJAX
* Bootstrap
* Marvel API

#### Back-end
* Rack
* Sinatra

## User Stories

https://drive.google.com/file/d/0B9Crbz5DCG-uSkdBalc4UWp5d3M/view?usp=sharing

## Unsolved Problems or Major Hurdles

I originally began the project more ambitiously, investigating the use of Meteor as a back-end framework and D3 as a means of visualizing data, but, due to time constraints and the limits of the Marvel API, eventually decided to limit the scope.

With no database, I had envisioned a front-end only app, but ran into difficulties with the API authentication. Marvel requires a public key, and a hash (a md5 digest of timestamp + a private key + the public key.) Therefore, I added a back-end using Sinatra which allows me to keep my environment variables safe.
