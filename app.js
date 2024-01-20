import express from 'express';
const app = express();
import { connect } from './schemas/index.js';
import route from './routes/product.router.js';
import path from 'path';
import 'dotenv/config';
import methodOverride from 'method-override';

const __dirname = path.resolve();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', route);

connect(); //mongodb연결

app.listen(3000, () => {
  console.log('localhost:3000 에서 실행중입니다');
});
