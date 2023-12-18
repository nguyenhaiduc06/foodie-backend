import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const auth = function  authenticateToken(req, res, next) {
  let token = req.headers.authorization; // Lấy JWT từ header (hoặc từ phần tử khác trong yêu cầu)

  if (token) {
    if (token.startsWith("Bearer ")) token = token.substring(7);
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'JWT không hợp lệ' });
      } else {
        req.principle = decoded; // Lưu thông tin người dùng từ JWT vào thuộc tính req.user
        next(); // Cho phép tiếp tục vào hàm xử lý chính
      }
    });
  } else {
    return res.status(401).json({ error: 'Bạn không có quyền truy cập' });
  }
}

