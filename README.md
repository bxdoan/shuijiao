# Kim Én Chinese

Ứng dụng web giúp học tiếng Trung thông qua các bài báo thời sự thực tế với pinyin và bản dịch.

URL:

https://shuijiao.vercel.app/


## Triển khai

Dự án này được cấu hình để triển khai trên Vercel. Chỉ cần kết nối repository GitHub của bạn với Vercel và nó sẽ tự động triển khai ứng dụng của bạn.

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem file LICENSE để biết chi tiết.

## Vercel Deployment

Để đảm bảo Vercel tự động triển khai mỗi khi push lên GitHub, làm theo các bước sau:

1. Tạo Vercel token:
   - Đăng nhập vào Vercel dashboard
   - Vào Settings > Tokens
   - Tạo token mới với quyền "Full Account"
   - Sao chép token

2. Thêm token vào GitHub Secrets:
   - Vào repository trên GitHub
   - Vào Settings > Secrets and variables > Actions
   - Thêm secret mới với tên `VERCEL_TOKEN` và giá trị là token đã tạo

3. Push code lên nhánh main hoặc master để trigger tự động deploy

**Lưu ý**: GitHub Actions workflow sẽ tự động trigger Vercel deployment khi có push mới.

