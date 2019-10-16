var mongoose = require('mongoose');
var env = require('dotenv');
env.config();

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongodb server");
});


mongoose.connect(process.env.mongoConfig, {useNewUrlParser:true});
var mongo = {
    setDebug : function(debug){
        if(debug){
            mongoose.set('debug', true);
            mongoose.set('debug', function (coll, method, query, doc) {
                console.log("★★★★★ coll ★★★★★\n",coll);
                console.log("★★★★★ method ★★★★★\n",method);
                console.log("★★★★★ query ★★★★★\n",query);
            });        
        }
        return;
    }
}

module.exports = mongo;