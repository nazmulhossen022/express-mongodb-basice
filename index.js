const express = require('express')
const mongoose = require('mongoose');

const app = express()


const port = 3000;

const connectDb = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/testProductBd', {useNewUrlParser: true});
        console.log('Db is connected');
    } catch (error) {
        console.log('Db is not connected');
        console.log(error.message);
        process.exit(1);
    }
}
mongoose.set('strictQuery', false);

app.listen(port, async () => {
    console.log(`server is running at http://localhost:${port}`);
    await connectDb();
})

app.use(express.json());

const fruitSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);


//all data show
app.get('/', async(req, res) => {
    try{
        const Alldata = await Fruit.find();
        if(Alldata){
            res.status(200).send({
                success: true,
                message: "return all data",
                data: Alldata
            });
        } else {
            res.status(404).send({
                success: false,
                message: "data not found"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

//find id and single data show

app.get('/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const singledata = await Fruit.find({_id: id});
        if(singledata){
            res.status(200).send({
                success: true,
                message: "return single data",
                data: singledata
            });
        } else {
            res.status(404).send({
                success: false,
                message: "data not found"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

//inseart data
app.post('/', async (req, res) => {

    const fruit = new Fruit({
        name: req.body.name,
        rating: req.body.rating,
        review: req.body.review
    });

    try{
        const savePost = await fruit.save();

        if(savePost){
            res.status(200).send({
                success: true,
                message: "data insert successfull",
                data: savePost
            });
        } else {
            res.status(404).send({
                success: false,
                message: "data insert faild"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
        //console.log('Error during record insertion : ' + err);
    }

  })

  //update data
  app.put('/:id', async (req, res) => {

    const fruit ={
        name: req.body.name,
        rating: req.body.rating,
        review: req.body.review
    }

    try{
        const id = req.params.id;
        const savePost = await Fruit.findByIdAndUpdate({_id:id},fruit,{ new: true });
        if(savePost){
            res.status(200).send({
                success: true,
                message: "data update successfull",
                data: savePost
            });
        } else {
            res.status(404).send({
                success: false,
                message: "data update faild"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
       // console.log('Error during record insertion : ' + err);
    }

  })

  //Delete data
  app.delete("/:id", async(req,res) => {
    try{
        const id = req.params.id;
        const savePost = await Fruit.findByIdAndRemove({_id:id});
        if(savePost){
            res.status(200).send({
                success: true,
                message: "data Delete successfull",
                data: savePost
            });
        } else {
            res.status(404).send({
                success: false,
                message: "data Delete faild"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
       // console.log('Error during record insertion : ' + err);
    }
  })