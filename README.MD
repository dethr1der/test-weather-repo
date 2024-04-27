<h1>Hello it's my mini test project written on Nest.js</h1>

<ol>
<li>
<strong>Please first of all change all env values to yours and rename .env_example to just .env</strong>
</li>
<li>
<strong>Than update docker-compose file to suit to your setup</strong>
</li>
<li>
<strong>docker-compose up</strong>
</li>
</ol>

<h3>To test the project</h3>

<ol>
<li>
Open postman and do the query to http://{your_host}/weather/fetch-and-save<br>
<strong>Body should be in JSON and look like this</strong>

{
"lat": 52.170471,
"lon": 20.811886
"part": "minutely" -- optional field
}

</li>
<li>
To recieve data from db you need to perform smth like that

http://{your_host}/weather/get-data?lat=52.1705&lon=20.8119&part=current

Where lat is latitude, lon is longitude, part is exactly data you want to see (current/minutely/hourly/daily)
</li>
<li>
<strong>enjoy testing</strong>
</li>
</ol>