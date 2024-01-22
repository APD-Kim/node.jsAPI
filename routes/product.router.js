import express from 'express';
const router = express.Router();
import production from './../schemas/product.schema.js';
import dateString from './../public/script.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

class dbHandling {

}

router.get('/', function (req, res) {
  return res.status(200).send('성공적으로 연결했습니다');
  // console.log(`hi`);
});
//용도를 나눈다
//상품 등록
router
  .route('/products')
  .post(async (req, res) => {
    try {
      let product = req.body;//컨트롤러
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(product.password, salt);
      let newProduct = new production({
        creator: product.creator,
        name: product.name,
        content: product.content,
        password: hashed, //비밀번호
        date: new Date(), //작성 날짜
      });//서비스(로직)
      await newProduct.save();//db i/o
      res.status(200).send('상품을 성공적으로 등록하였습니다.');//컨트롤러
    } catch {
      res.status(500).send('서버 에러 발생');//컨트롤러
    }
  })
  //bcrypt, 오류처리,
  //상품 목록 조회
  .get(async (req, res) => {
    try {
      let result = await production.find().sort({ date: -1 });
      if (!result) {
        return res.status(404).send('상품 조회에 실패하였습니다.');
      }
      res.json(result);
    } catch {
      res.status(500).send('서버 에러 발생');
    }
  });
//상품 상세 조회
router
  .route('/products/:id')
  .get(async (req, res) => {
    try {
      let result = await production.findOne({ _id: new ObjectId(req.params.id) });
      if (!result) {
        return res.status(404).send('상품 조회에 실패하였습니다.');
      } else {
        res.json({
          name: result.name,
          content: result.content,
          creator: result.creator,
          data: result.date,
        });
      }
    } catch {
      return res.status(500).send('서버 에러 발생');
    }
  })
  //상품 정보 수정
  .put(async (req, res) => {
    try {
      let result = await production.findOne({ _id: new ObjectId(req.params.id) });
      if (!result) {
        return res.status(404).send('상품 조회에 실패하였습니다.');
      }
      const validPassword = await bcrypt.compare(req.body.password, result.password);
      if (validPassword) {
        await production.updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              name: req.body.name,
              content: req.body.content,
              isValid: req.body.isValid,
            },
          }
        );
        return res.status(200).send('상품이 성공적으로 수정되었습니다.');
      } else {
        return res.status(401).send('비밀번호가 맞지 않습니다');
      }
    } catch (e) {
      res.status(500).send('서버 에러 발생');
    }
  })

  //데이터베이스 설계
  //테스트코드
  //인프라
  //보안
  //쿼리최적화
  //레이어드 패턴
  //상품 정보 삭제
  .delete(async (req, res) => {
    //프레젠테이션 레이어
    try {
      let result = await production.findOne({ _id: new ObjectId(req.params.id) });
      console.log(result); //퍼시스턴트 레이어
      if (result.length === 0) {
        return res.status(404).send('상품 조회에 실패하였습니다.');
      }
      const validPassword = await bcrypt.compare(req.body.password, result.password);
      if (validPassword) {
        //비즈니스 레이어
        await production.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        return res.status(200).send('성공적으로 상품이 삭제되었습니다.');
      } else {
        return res.status(401).send('비밀번호가 맞지 않습니다');
      }
    } catch (e) {
      return res.status(500).send('서버 에러 발생');
    }
  });
//검색기능
router.post('/products/search', async (req, res) => {
  try {
    const {name} = req.query;
    let result = await production.find({ name: new RegExp(name, 'i') });
    if (result.length === 0) {
      return res.status(404).send('검색 결과가 없습니다.');
    } else {
      res.json(result);
    }
  } catch {
    res.status(500).send('서버 에러 발생');
  }
});



export default router;
