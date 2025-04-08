export const base_url = "http://192.168.1.51:5000"
// const base_url =" https://759f-2401-4900-1c6e-a851-8558-116-5c86-bf75.ngrok-free.app"
API = {
    "login": base_url+"/api/auth/login",
    "profile":base_url+"/api/auth/profile",
//user
"updateProfile":base_url+"/api/users/profile",
    // attendance
    "attendanceStatus":base_url+"/api/attendance/status/",
    "attendanceCheckIn":base_url+"/api/attendance/check-in",
    "attendanceCheckOut":base_url+"/api/attendance/check-out",
    "postWorkImages":base_url+"/api/attendance/work-images",
    "userAttendance":base_url+"/api/attendance/user/",

    // upload photos
    "uploadPhoto":base_url+"/api/photos/upload-multiple",

    // sites

    "sites":base_url+"/api/sites"
}
export default API