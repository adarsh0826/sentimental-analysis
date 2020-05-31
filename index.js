var express = require('express');
var twitter = require('twitter');
var config = require('./config').key;
var Sentiment = require('sentiment');
var bodyParser = require('body-parser');

var sentiment = new Sentiment();
var T = new twitter(config);
var app = new express();
 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json())


app.get('/', (req,res)=>{
	
	res.redirect('/home');
})

app.get('/home',(req,res)=>{

	res.sendFile(__dirname + "/home.html")
})

app.post('/home',async function(req,res){
	console.log("Post request made by client");
	console.log(req.body);
	let result ={"score":3}
	if(req.body.query){
		result = sentiment.analyze(req.body.query);
		console.log("s ",result);
		res.send(result);
	}
	if(req.body.category ){
		console.log("one")
		analyseWithTwitter(req.body.category,req.body.count)
		.then(result=> {
			JSON.stringify(result);
			res.send(result);
		})
	}

app.get('*',(req,res)=>{
	res.redirect('/home');
})

})

app.listen( 3000,console.log("Server listening at port 3000"));



 function analyseWithTwitter(category,count){
	var res =[];
	return T.get("search/tweets", {q:category, count:count })
    .then( (tweets)=>{
		console.log(" getting twets :",res)
		for(let i=0; i<tweets.statuses.length; i++){
			let string = tweets.statuses[i].text ;
			console.log(tweets.statuses[i].text)
			res.push(sentiment.analyze(string));
		}
		//console.log("FInal result",res)  returns array 
    	return res;
    })

    .catch(function(err){
    	console.log("error getting tweets :",err);
    	return res;
    })	
    
} 

 function test(){
analyseWithTwitter("Hey",2).then(res=>console.log("HAhahahaha",res));
//console.log("value of res is:",res)
//res = await analyseWithTwitter("Hey",2);
//console.log(res)  //this is executing first
}
