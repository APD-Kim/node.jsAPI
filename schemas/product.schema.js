import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  creator: String,
  name: String,
  content: String,
  password: String, //비밀번호
  date: Date, //작성 날짜
  isSale: Boolean, //상태, true면 판매 중, false면 판매완료

  //data 안에 상품 내용, 작성자 이름, 비밀번호, 상태(판매중, 판매완료),작성 날짜
});

export default mongoose.model('production', productSchema);
