import { config } from "dotenv";
import app from './app.ts';

config();

const PORT = process.env.PORT || 3007;


app.listen(PORT, ()=>{
    console.log('App is running on PORT : ' + PORT)
});

