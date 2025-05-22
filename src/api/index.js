export const base_url = 'http://192.168.1.12:5001';
// export const base_url = 'http://172.20.10.3:5001';
// export const base_url = 'https://crystaloak-node.onrender.com';

// const base_url =" https://759f-2401-4900-1c6e-a851-8558-116-5c86-bf75.ngrok-free.app"
const API = {
  login: base_url + '/api/auth/login',
  profile: base_url+'/api/auth/profile',
  //user
  updateProfile: base_url + '/api/users/profile',
  updatePassword: base_url + '/api/users/change-password',
  // attendance
  attendanceStatus: base_url + '/api/attendance/status/',
  attendanceCheckIn: base_url + '/api/attendance/check-in',
  attendanceCheckOut: base_url + '/api/attendance/check-out',
  postWorkImages: base_url + '/api/attendance/work-images',
  userAttendance: base_url + '/api/attendance/user/',
  // upload photos
  uploadPhoto: base_url + '/api/photos/upload-multiple',
  // sites
  sites: base_url + '/api/sites',
  enabledSites: base_url + '/api/sites/enabled',
  //admin
  adminDashboard: base_url + '/api/admin/dashboard',
  addEmployee: base_url + '/api/users',
  dateAttendance: base_url + '/api/admin/attendance/date/',
  //employees
  employees: base_url + '/api/admin/employees',
  resetPassword: base_url + 'api/admin/employees/resetpassword/',
  enabledEmployees: base_url + '/api/admin/employees/enabled',
  report: base_url + '/api/admin/attendance/report',
  //services
  services: base_url + '/api/services',
  //feedback
  feedback: base_url + '/api/feedback',
  deleteFeedback: base_url+"/api/feedback/",
  //inquiry
  inquiry: base_url + '/api/inquiry',
  //estimations
  estimations:base_url +"/api/estimations",
  //shifts
  shifts: base_url + '/api/settings/shifts',
  //holidays
  holidays: base_url + '/api/holidays',
  //paysip
  payslip: base_url + '/api/admin/employees/payslip/'
};

export default API;