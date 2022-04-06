const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jpgna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();

        const database = client.db('calendarEvent');
        const eventCollection = database.collection('events');

        // get api
        app.get('/events', async(req, res)=>{
            const {date, email} = req.query;
            if(date){
                const query = {eventDate:date, userEmail:email};
                const cursor = eventCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }
            else{
                const query = {userEmail:email};
                const cursor = eventCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }
            // const cursor = eventCollection.find({});
            // res.send(result);
        })

        // post API 
        app.post('/events', async(req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.send(result)
        });

        app.delete('/events/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await eventCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello, from server");
});

app.listen(port, () =>{
    console.log("listening at port", port);
})