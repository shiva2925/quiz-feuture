import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//let apiurl = "http://43.204.36.226";
// let apiurl ="https://asseshub.com";
let apiurl = "http://localhost:8080";
const tenantid = "bb54fcfc";
//https://docs.expo.dev/workflow/web/


export const GetApi = async (fields, action) => {

 
  const headers = {
    'content-type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'x-access-token': '',

   

  }

  let url = '';
  if (action == 'INTRO') {
    url = '/api/v1/logo/get';
  }
  if (action == 'TENANT') {
    url = '/api/v1/tenant/get';
  }

  if (action == 'LOGIN') {
    url = '/api/v1/auth/loginuser';
  }
  if (action == 'VERIFY') {
    url = '/api/v1/auth/verifyotp';
  }
  if (action == 'CONSTITUENCY') {
    url = '/api/v1/areas/get';
  }
  if (action == 'SIGNUP') {
    url = '/api/v1/auth/signup';
  }

  if (action == 'STRIPEKEY') {
    url = '/api/v1/users/stripekeys';
  }
  if(action =='SENDVERIFYMOBILE'){
    url = '/api/v1/auth/sendverifymobilenumber';
  }
  if(action =='VERIFYMOBILE'){
    url = '/api/v1/auth/verifymobilenumber';
  }

  if (action == 'STATES') {
    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/states/get';
  }

  if (action != 'SIGNUP' && action != 'LOGIN' && action != 'VERIFY' && action !='STRIPEKEY' && action !='STATES'
   && action !='SENDVERIFYMOBILE' && action !='VERIFYMOBILE') {
    console.log("inside 47");
    fields.query.tenantid = tenantid;
  }
  if (action == 'LOGIN' || action == 'VERIFY' || action !='STRIPEKEY' || action !='NONITSKILLS' || action !='STATES' 
  || action !='SENDVERIFYMOBILE' && action !='VERIFYMOBILE') {
    fields.tenantid = tenantid;
  }
  console.log(url);
  console.log(fields);
  if(action =='NONITSKILLS'){ 
   // alert(JSON.stringify(fields));
  }

  return await axios.post(apiurl + url, fields, { 'headers': headers })
    .then((res) => {
      console.log(res);
      return res.data;
    }).catch((error) => {
      // window.location = "/";
      return error;
    });


}


export const PostApi = async (fields, action) => {
  console.log(fields, action, "check data")
  // const constuserdetails = JSON.parse(localStorage.getItem('userDetails'));
  const sessiondetails = await AsyncStorage.getItem('userdata');
  const constuserdetails = JSON.parse(sessiondetails);

  const headers = {
    'content-type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'x-access-token': ""



  }

  //alert("action"+action);

  let url = '';

  if (action == 'TENANT') {
    url = '/api/v1/tenant/get';
  }

  if (action == 'ANNOUNCEMENTS') {
    url = '/api/v1/common/get';
  }

  if (action == 'BANNER') {
    url = '/api/v1/banner/get';
  }
  if (action == 'VPTTYPES') {
    url = '/api/v1/headertypes/get';
  }

  if (action == 'YOUTUBEVIDEOS') {
    url = '/api/v1/videos/get';
  }

  if (action == 'CONSTITUENCYDEV') {
    url = '/api/v1/sliderimages/get';
  }
  if (action == 'EVENTS') {
    url = '/api/v1/events/get';
  }
  if (action == 'NEWS') {
    url = '/api/v1/news/get';
  }

  if (action == 'UNIVERSITY') {
    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/university/get';
  }

  if (action == 'EDUCATIONTYPES') {
    url = '/api/v1/edutypes/get';
  }
  if (action == 'CATEGORY') {
    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/category/get';
  }
  if (action == 'EDUCATION') {

    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/education/get';
  }

  if (action == 'NONITSKILLS') {
    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/itprograms/get';
  }

  if (action == 'STATES') {
    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/states/get';
  }

  if (action == 'ITPROGRAMS') {
    fields.userid ="6551a9d19f73e81d7c6e7cb4";
    fields.tenantid =tenantid;
    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/itprograms/get';
  }

  if (action == 'EDUPORGRAMS') {
    console.log("tenantid" + tenantid);
    fields.query.tenant = { $elemMatch: { "value": tenantid } };
    url = '/api/v1/eduprograms/client';

    
  }

  if (action == 'PROGRAMCOURSES') {
    fields.userid =constuserdetails.user.id;
    url = '/api/v1/programcourses/get';
  }

  if (action == 'STUDENTPROGRAM') {

    url = '/api/v1/studentcourses/get';
  }

  if (action == 'ACADEMICCOURSES') {

    url = '/api/v1/academics/get';
  }

  if (action == 'INDIVIDUALEDUPROGRAM') {

    url = '/api/v1/eduprograms/get';
  }

  if (action == 'ITPROGRAMING') {
    url = '/api/v1/itprograms/details';
  }
  if (action == 'STUDENTPROGRAMMING') {
    url = '/api/v1/studentcourses/details';
  }
  if (action == 'ACADEMICDETAILS') {
    url = '/api/v1/academics/details';
  }

     
  if (action == 'EDUCATIONTYPES') {
    url = '/api/v1/edutypes/get';
  }

  if (action == 'SEMISTER') {
    url = '/api/v1/semisters/get';
  }

  if (action == 'BRANCHES') {
    url = '/api/v1/branches/get';
  }
  if (action == 'ACADEMICTYPE') {
    url = '/api/v1/academicstypes/get';
  }
  if(action =='DASHOARDLABEL'){ 
    url = '/api/v1/common/get';
  }
  if(action =='GETDASHOARDLABEL'){
    url = '/api/v1/common/get';
  }
 
  if(action =='GETDASHOARDLABEL1'){
    url = '/api/v1/common/get';
  }
  if(action =='TRAININGENROLLMENT' || action =='SAVESKILLS' || action =='SAVECERTIFICATE'
   || action =='SAVEUSERPROJECT' ||action =='USEREDUCATION' || action =='SAVEHOBBIES' || action =='SAVEUSERREFERENCES' 
    ||action =='SAVEUSERMAKRS' ){
    url = '/api/v1/common/save';
  }
  if(action =='TRAININGENROLLMENTGET' || action =='USERSKILLS' || 
     action =='USERCERTIFICATE' || action =='USERPROJECTS' ||action =='USERSUBSCRIPTION'
     || action =='GETUSEEDUCATION' || action =='USERHOBBIES' || action =='USERREFERENCES'||
     action =='USERMARKS'){
    url = '/api/v1/common/get';
  }
  if(action =='DELETESKILLS' || action =='DELETECERTIFICATE' || action =='DELETEUSERPROJECT' || action =='DELETEHOBBIES'
   || action =='DELETEUSERREFERENCES' || action =='DELETEUSERMARKS'){
    url = '/api/v1/common/delete';
  }

  if(action =='UPDATEUSERPROJECT' || action =='UPDATEUSEREDUCATION'|| action =='SAVEUSERINFO'){
    url = '/api/v1/common/update';
  }

  if(action =='TRAININGCOURSES'){
    url ='/api/v1/trainingcourses/get'
  }
  if(action =='PLATFORMPURCHASE'){
    url ='/api/v1/users/subscribe';
  }

  if(action =='GENERATERESUME'){
    url ='/api/v1/users/resume';
  }


  if(action =='GETQUIZ'){
    url ='/api/v1/questions/start';
  }
  if(action =='CHECKANSWER'){
    url ='/api/v1/questions/checkanswer';
  }
  if(action =='FINISHQUIZ'){
    url ='/api/v1/questions/finish';
  }
  if(action  =='CHECKSTARTQUIZ'){
    fields.userid =constuserdetails.user.id;
    url ='/api/v1/users/checkstartquiz'
  }

  if(action  =='FINISHITEM'){
    fields.userid =constuserdetails.user.id;
    url ='/api/v1/users/finishsectionitems'
  }
  if(action  =='FINISHCOURSE'){
    fields.userid =constuserdetails.user.id;
    url ='/api/v1/users/finishprogramcourses'
  }

  if(action  =='ENROLL'){
    fields.userid =constuserdetails.user.id;
    url ='/api/v1/users/enrollcourse'
  }

  if(action  =='ANALYTICS'){
    fields.userid =constuserdetails.user.id;
    url ='/api/v1/users/getuserdataanalytics'
  }

  if(action =='RETAKE'){
    url ='/api/v1/questions/retake';
  }

  if (action == 'BANNER' || action == 'EVENTS' || action == 'YOUTUBEVIDEOS' ||
    action == 'CONSTITUENCYDEV' || action == 'NEWS') {
    if (constuserdetails.user?.subapplicationid) {
      fields.query.subapplicationid = constuserdetails.user.subapplicationid
    }
  }
   
  if (action != 'EDUCATIONTYPES' && action != 'EDUCATION' && action != 'CATEGORY'
    && action != 'NONITSKILLS' && action != 'STATES' && action != 'ITPROGRAMS'
    && action != 'PROGRAMCOURSES' && action != 'ITPROGRAMING' && action != 'EDUPORGRAMS'
    && action != 'STUDENTPROGRAM' && action != 'STUDENTPROGRAMMING'
    && action != 'SEMISTER'  && action != 'BRANCHES'  && action != 'ACADEMICTYPE'
    && action !='ACADEMICCOURSES' && action !='ACADEMICDETAILS' && action !='INDIVIDUALEDUPROGRAM'
    && action !='DASHOARDLABEL'  && action !='TRAININGENROLLMENT' && action !='TRAININGENROLLMENTGET'
    && action !='DELETESKILLS' && action !='USERSKILLS' && action !='SAVESKILLS'
    && action !='SAVECERTIFICATE' && action !='USERCERTIFICATE' && action !='DELETECERTIFICATE'
    && action  !='SAVEUSERPROJECT' && action !='USERPROJECTS' && action  !='UPDATEUSERPROJECT'
    && action !='DELETEUSERPROJECT'  && action != 'UNIVERSITY' && action !='TRAININGCOURSES'
    && action !='USERSUBSCRIPTION' && action !='USEREDUCATION' && action !='GETUSEEDUCATION'
    && action !='UPDATEUSEREDUCATION' && action !='SAVEUSERINFO' && action !='PLATFORMPURCHASE'
    && action !='GENERATERESUME' && action !='USERHOBBIES' && action !='SAVEHOBBIES' && action !='DELETEHOBBIES'
    && action !='SAVEUSERREFERENCES' && action !='DELETEUSERREFERENCES' && action !='USERREFERENCES' 
    && action !='GETQUIZ' && action !='CHECKANSWER' && action !='FINISHQUIZ'
    &&  action !='USERMARKS' &&  action !='SAVEUSERMAKRS' &&  action !='DELETEUSERMARKS' && action !='CHECKSTARTQUIZ'
    && action  !='FINISHITEM' && action !='ENROLL' && action !='FINISHCOURSE' && action !='RETAKE' && action !='ANALYTICS')  {

    
    fields.query.tenantid = tenantid;
  }

  console.log(url);
  console.log(fields);

  
  

  return await axios.post(apiurl + url, fields, { 'headers': headers })
    .then((res) => {
      console.log(res);
      return res.data;
    }).catch((error) => {
      // window.location = "/";
      return error;
    });


}

export const GetCourses = async (fields) => {
  return await axios.get(apiurl + "/wp-json/learnpress/v1/courses")
    .then((res) => {
      console.log(res);
      return res.data;
    }).catch((error) => {
      // window.location = "/";
      return error;
    });


}

export const GetDetailcourse = async (id) => {
  return await axios.get(apiurl + `/wp-json/learnpress/v1/courses/${id}`)
    .then((res) => {

      return res.data;
    }).catch((error) => {
      // window.location = "/";
      return error;
    });


}

// export const GetDetailQuetions= async (id) => {
//   return await axios.get(apiurl + `/api/v1/questions/get/${id}`)
//     .then((res) => {
//  console.log(res, "check response")
//       return res.data;
//     }).catch((error) => {
//       // window.location = "/";
//       return error;
//     });


// }






