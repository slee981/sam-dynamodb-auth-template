curl -X POST -d '{"email": "email@example.com", "password": "test123"}' http://localhost:3000/auth/signup
curl -X POST -d '{"email": "email@example.com", "password": "test123"}' http://localhost:3000/auth/login
curl -X POST -d '{"email": "email@example.com"}' http://localhost:3000/auth/forgot
curl -X POST -d '{"email": "email@example.com", "password": "test123"}' http://localhost:3000/auth/reset?resetToken=9yiypf3e5i404tf3s0vtvz2yf862ox8i

