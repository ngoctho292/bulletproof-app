API LẤY TOKEN:
REQUEST:
curl --location 'https://api_cds.hcmict.io/api/auth/login?t=1763002773668' \
--header 'accept: */*' \
--header 'accept-language: en,vi-VN;q=0.9,vi;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5' \
--header 'content-type: application/json' \
--data-raw '{"username":"nntho.hcm","password":"Vnpt@1234"}'
RESPONSE: 
{
    "message": "Success",
    "data": {
        "token": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJubnRoby5oY20iLCJqdGkiOiIxY2Y3M2Y0ZC1lYmQwLTRkMWEtOWFmMy1kZmM3YTg0NTU0NTgiLCJpYXQiOjE3NjMwMDMwODUsIm5iZiI6MTc2MzAwMzA4NSwiZXhwIjoxNzYzMDg5NDg1LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMxMSIsImF1ZCI6IktoYW5oTmd1eWVuSVQifQ.WpBlQWArpq1R03BzmB-GmEyTOO2IXNH8h6LTs2v5rF0",
            "expires_in": 86400
        },
        "user": {
            "user_id": 1669,
            "username": "nntho.hcm",
            "password": "AQAAAAEAAAPoAAAAENCkYdqpBa6WHfOGsdUygb+mfr4cTh7PB6GUt1N7hwG1gQLJtWYa0A0+skhtTDRvdA==",
            "telegram_id": "@ngoctho_hcm",
            "active": true,
            "role_id": 2,
            "status": 1,
            "show_notify": 1
        }
    },
    "error": null,
    "success": true,
    "statusCode": 0
}

API GET DANH SÁCH TASK:
REQUEST:
curl --location 'https://api_cds.hcmict.io/api/work/TaskReport/GetReportTaskByUserCurrentFunc?searchText=&arrUserIds=%5B1669%5D&startDate=01%2F01%2F2025&endDate=13%2F11%2F2025&t=1763003126036' \
--header 'accept: */*' \
--header 'accept-language: en,vi-VN;q=0.9,vi;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJubnRoby5oY20iLCJqdGkiOiI2NTQ5NDYxOS1lZDI1LTQ0NmUtYWNhNS1lMmY3NGViODBlNTYiLCJpYXQiOjE3NjMwMDI3NzQsIm5iZiI6MTc2MzAwMjc3NCwiZXhwIjoxNzYzMDg5MTc0LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMxMSIsImF1ZCI6IktoYW5oTmd1eWVuSVQifQ.lTujczBVfwFCKa6gsLk3X6SDXIkKeqhtl3zigTD261w'
RESPONSE SẼ LẤY DỮ LIỆU BÊN TRONG BIẾN <doing_assignee_task_start>:
{
    "done_assignee_task": [
        {
            "code": "SBN.2024.01.022.63063.001",
            "avatar": "Upload/Profile/nntho.hcm/Avatar/20251014092548284_images.jpg"
        }
    ],
    "doing_assignee_task_start": [
        {
            "code": "000.64790",
            "avatar": "Upload/Profile/nntho.hcm/Avatar/20251014092548284_images.jpg",
            "rating": null,
            "status": 2,
            "step_id": 1343,
            "task_id": 57900,
            "jira_url": "",
            "parent_id": null,
            "status_id": 10,
            "task_name": "Xây dựng thuyết minh tổng thể",
            "actual_end": null,
            "create_day": "2025-11-11T17:42:45.709654",
            "project_id": null,
            "assignee_id": 1669,
            "creator_flg": false,
            "prefix_name": "T",
            "schedule_ed": "2025-11-12",
            "schedule_sd": "2025-11-11",
            "account_name": "Nguyễn Ngọc Thọ",
            "assignee_flg": true,
            "project_name": "",
            "running_flag": 1,
            "schedule_end": "12/11/2025",
            "task_creator": 1891,
            "schedule_start": "11/11/2025",
            "complaint_status": null,
            "actual_execution_time": 4.78,
            "planned_duration_time": 3
        }
    ],
}

API BẮT ĐẦY TASK & DỪNG TASK:
REQUEST:
curl --location 'https://api_cds.hcmict.io/api/work/Task/DoingTask?t=1763003887489' \
--header 'accept: */*' \
--header 'accept-language: en,vi-VN;q=0.9,vi;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJubnRoby5oY20iLCJqdGkiOiI2NTQ5NDYxOS1lZDI1LTQ0NmUtYWNhNS1lMmY3NGViODBlNTYiLCJpYXQiOjE3NjMwMDI3NzQsIm5iZiI6MTc2MzAwMjc3NCwiZXhwIjoxNzYzMDg5MTc0LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMxMSIsImF1ZCI6IktoYW5oTmd1eWVuSVQifQ.lTujczBVfwFCKa6gsLk3X6SDXIkKeqhtl3zigTD261w' \
--header 'content-type: application/json' \
--data '{"task_id":56608}'
RESPONSE:
{
    "message": "Success",
    "data": "1",
    "error": null,
    "success": true,
    "statusCode": 0
}

API BÁO CÁO TASK:
REQUEST:
curl --location 'https://api_cds.hcmict.io/api/work/TaskComment/AddTaskComment?t=1763004221262' \
--header 'accept: */*' \
--header 'accept-language: en,vi-VN;q=0.9,vi;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJubnRoby5oY20iLCJqdGkiOiI2NTQ5NDYxOS1lZDI1LTQ0NmUtYWNhNS1lMmY3NGViODBlNTYiLCJpYXQiOjE3NjMwMDI3NzQsIm5iZiI6MTc2MzAwMjc3NCwiZXhwIjoxNzYzMDg5MTc0LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMxMSIsImF1ZCI6IktoYW5oTmd1eWVuSVQifQ.lTujczBVfwFCKa6gsLk3X6SDXIkKeqhtl3zigTD261w' \
--header 'content-type: application/json' \
--data '{"comment":"https://docs.google.com/document/d/1EvWGnelyKj1iucdjVERlz2KpXAz7UMRB1crbzUBn_d4/edit?usp=drive_link","task_id":57900,"file_attachment_ids":[]}'
RESPONSE:
{"message":"Success","data":"1","error":null,"success":true,"statusCode":0}

API HOÀN THÀNH TASK VÀ HUỶ HOÀN THÀNH CÔNG VIỆC:
REQUEST:
curl --location 'https://api_cds.hcmict.io/api/work/Task/DoneTask?t=1763004442377' \
--header 'accept: */*' \
--header 'accept-language: en,vi-VN;q=0.9,vi;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJubnRoby5oY20iLCJqdGkiOiI2NTQ5NDYxOS1lZDI1LTQ0NmUtYWNhNS1lMmY3NGViODBlNTYiLCJpYXQiOjE3NjMwMDI3NzQsIm5iZiI6MTc2MzAwMjc3NCwiZXhwIjoxNzYzMDg5MTc0LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMxMSIsImF1ZCI6IktoYW5oTmd1eWVuSVQifQ.lTujczBVfwFCKa6gsLk3X6SDXIkKeqhtl3zigTD261w' \
--header 'content-type: application/json' \
--data '{"task_id":56604}'
RESPONSE:
{"message":"Success","data":"1","error":null,"success":true,"statusCode":0}

YÊU CẦU MONG MUỐN:
- Xây dựng trang đăng nhập phiên bản 2 (không đụng gì tới đăng nhập hiện tại)
- Xây dựng trang để quản lý và thao tác các task:
    - Hiển thị danh sách task với Tên Task, Code Task, Ngày bắt đầu (schedule_start), Ngày kết thúc (schedule_end), Số giờ yêu cầu (planned_duration_time)
    - Thao tác hoàn thành và huỷ hoàn thành task
    - Thao tác bắt đầu task và dừng task
    - Báo cáo task
    - Hiển thị toast khi thao tác xong
- Giao diện đẹp mắt, tinh giản, ít thao tác (kiểu như là các chức năng sẽ ở trên card luôn không cần nhấn vào xem chi tiết)
