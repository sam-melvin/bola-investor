let isLive = false;

let api = '';
$(function () {
  

  if (window.location.href.indexOf("test") > -1) {

    api = 'http://test-bolaswerte.bolaswerte.com/api/';
  }
  else {
    api = 'http://bolaswerte.bolaswerte.com/api/';
  }


$("#spinner").hide();
var bgclass = "btn btn-app bg-success";
var hideLive = $('#hideLive').val();
console.log("hideLive: " + hideLive);

if(hideLive == 1){
     isLive = true;
     
}

$("#div_loader").hide();
$("#div_investor").hide();




})


  let prov = 0;
  let seq = 0;


  // $('#drawDate').on('change', function() {
  //   console.log("update");
  //   let drawId = $('#drawAllSlot').val();
  //   // getAllTotalAmountBets(drawId);
  //  });

  


  var getProvince = function() {
    $('#bet_table').html('');
    if(prov == 0){
        $.ajax({
        type:'post',
        url: 'getprovince.php',
        data : {},
        success : function(data){
            console.log("data province: " + data);
            $('#seletProvince').html(data);
        }
        
    })
    prov = 1;
    }
    
};

let code = '';

var getCode =  function(datas,isApproved) {
    // $('#bet_table').html('');
    
    let pass = generateRandomPass();
    
    if(seq == 0){
        $.ajax({
        type:'post',
        url: 'loader_seq.php',
        data : {},
        success : function(data){
            console.log("loader data: " + data);
            // $("#code").val("BSL-"+data);
            // $("#code").val("BSL-"+data);
             let code = "BSL-"+data;
             sendEmail(pass,code,datas,isApproved);
            
        }
        
    })
    seq = 1;
    }

};

$('#live_switch').change(function() {
    console.log("data: ");
    if(this.checked) {
         
        // var returnVal = confirm("Are you sure?");
        // $(this).prop("checked", returnVal);
    }
    // $('#textbox1').val(this.checked);        
});


$('#btnSigninAdmin').on('click', function() {
    var user_name = $('#user_name').val();
    var man_pass = $('#man_pass').val();
    var weHaveSuccess = false;
    var emptFields = false;

    if(user_name == "" || man_pass == "")
        emptFields = true;

      $.ajax({
          type: "POST",
          url: "signin.php",
          dataType:"text",
          data: {
            user_name: user_name,
              man_pass: man_pass
          },
          cache: false,
          success: function(res){
              console.log('dataResult: ' + res);
                  if(res === 'success')
                  {
                    weHaveSuccess = true;
                    location.replace("./");
                    
                  }
                  else {
                      weHaveSuccess = false;
                  }

          },
          error: function(xhr, status, error){
              alert("Error!" + xhr.status);
          },
          complete: function(){
            if(!weHaveSuccess){
                $('#signinAdmin').find('input:password').val('');
                Swal.fire(
                  'Invalid email/password.',
                  '',
                  'error'
                )
                
            }

            if(emptFields){
                Swal.fire(
                  'Some fields are empty.',
                  '',
                  'error'
                )
            }
        },
      });
  });


  var approvedApplication = async function(datas,isApproved) {
    
    console.log('data ids:' + datas);
    console.log('data isApproved:' + isApproved);
    let stats = 'DECLINE';
    if(isApproved)
    stats = 'Approve';
  
      Swal.fire({
        title: 'Do you want to '+ stats +' the Application?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        denyButtonText: `Cancel`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            if(isApproved)
            getCode(datas,isApproved);
            else
            saveDataApp('','',datas,isApproved);
            
            
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    
    };
  
  
    var saveDataApp = async function(pass,code,datas,isApproved) {
        
    console.log('code: ' + code);
      let status = 'declined';
      if(isApproved)
        status = 'approved'
      
      // let sdatas = JSON.stringify(datas); 
      console.log('status: ' + status);
      console.log('pass: ' + pass);
      $.ajax({
        type:"post",
        dataType: "json",
        data:{
          ids: datas.ids,
          code: code,
          password: pass,
          username: datas.username,
          email: datas.lemail,
          phone_no: datas.phone,
          gcash_no: datas.gcash,
          full_name: datas.fname,
          assign_location: datas.province,
          status: status
        },
        url:"http://bolaswerte.bolaswerte.com/api/loaderApplication/",
        success:function(res)
        {
            Swal.fire('Saved!', '', 'success')
          setTimeout(function(){ location.reload(); }, 2000);// 2seconds
            const myJson = res;
            const textres = res.data;
            console.log('res: ' + myJson);
            
            
        },
        error : function(result, statut, error){ // Handle errors
          console.log('result: ' + result.responseText);
          // let myJson = JSON.stringify(result);
          // console.log('result: ' + myJson);
        },
        complete: function() {
            $("#spinner").hide();
            //A function to be called when the request finishes 
            // (after success and error callbacks are executed). 
        }
        
     });
  
        
  };


  var sendEmail = async function(pass,code,datas,isApproved) {
    $("#spinner").show();
    console.log('code: ' + code);
      let bodymsg = '';
      if(isApproved) {
        bodymsg = "Congratulations <strong>" + datas.fname + "</strong>, your application to be a loader has been approved. You credentials to login listed below. <br/>" +
        "<i>Congratulations, ang iyong application bilang maging loader ay pumasa. Ang mga detalye para ikaw ay makapaglogin ay nakalista sa baba. </i><br/>" +
        "Login Site: admin.bolaswerte.com <br/>" +
        "Email: " + datas.lemail + "<br/>" + 
        "Username: " + datas.username + "<br/>" + 
        "Password: " + pass + "<br/>" +
        "<p><strong>Note:</strong>Since the password is auto generate, We advice to change your password after you login. Thank you. <br/>" + 
        "<p><i><strong>Note:</strong>Dahil ang password ay kusang ginawa ng system, ang aming payo ay palitan agad ang iyong password pagkatapos mag login. Maraming Salamat. <br/>" +

        "<p>Para sa iba pang klaripikasyon at kahit anu man tungkol sa bolaswerte tumawag lamang sa aming hotline: .<strong>7777-123456</strong>";
      }
      else {
        bodymsg = "We would like to inform you that your application to be a loader has been denied. You can try again and fill up the informations accurately. Thank you. </i>";
      }
      
      // let sdatas = JSON.stringify(datas); 


      
    let subject = "Account Verification";

      $.ajax({
        type:"post",
        dataType: "json",
        data:{
          fname: datas.fname,
          email: datas.lemail,
          bodymsg: bodymsg,
          subject: subject
          
        },
        url:"sent_mail.php",
        success:function(res)
        {
            saveDataApp(pass,code,datas,isApproved);
          
            const myJson = res;
            console.log('res: ' + myJson);
           
        },
        error : function(result, statut, error){ // Handle errors
          console.log('result: ' + result.responseText);
          // let myJson = JSON.stringify(result);
          // console.log('result: ' + myJson);
        }
        
     });
  
        
  };




  var generateRandomPass = function() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var password = "";

    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
       }

    return password;
  }


  $('#selProvince').change(function() {
    var province = $('#selProvince').val();
    
    $.ajax({
      type:'get',
      url: 'getAdminLoader.php',
      data : {province: province},
      success : function(data){
          console.log("data: " + data);
          $('#selReceiver').html(data);
          
      }
      
      })
    // do stuff here;
  });

//   var getProvince = function() {
     
//     // $('#bet_table').html('');
//     if(prov == 0){
        
//     prov = 1;
//     }
    
// };


var confirmSendLoad = function() {
  
// var cds = JSON.stringify(cd);
// console.log('cds : ' + cds );
  Swal.fire({
    title: 'Do you want to send money?',
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: 'Proceed',
    denyButtonText: `Cancel`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
        sendMoney();
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
}

var sendMoney = function() {
 
  console.log('save');
  let receiver = $('#selReceiver').val();
  let amount = $("#amount").inputmask('unmaskedvalue');
  let code = $('#selReceiver').find(':selected').data('code');
  let adminId = $('#adminId').val();
  let ref_no = $('#ref_no').val();
console.log("code: " + code);
  $.ajax({
    type:"post",
    dataType: "json",
    data:{
      code:code,
      financer_id: adminId,
      admin_id: receiver,
      ref_no: ref_no,
      amount: amount
      
    },
    url:"http://bolaswerte.bolaswerte.com/api/sendMoney/",
    success:function(res)
    {
        Swal.fire('Saved!', '', 'success')
      setTimeout(function(){ location.reload(); }, 3000);// 2seconds
        const myJson = res;
        const textres = res.data;
        console.log('res: ' + myJson);
        
        
    },
    error : function(result, statut, error){ // Handle errors
      console.log('result: ' + result.responseText);
      // let myJson = JSON.stringify(result);
      // console.log('result: ' + myJson);
    },
    complete: function() {
        $("#spinner").hide();
        //A function to be called when the request finishes 
        // (after success and error callbacks are executed). 
    }
    
 });
}


$("#addFundsbtn").click(function(){
  let amountBal = $("#amount_bal").inputmask('unmaskedvalue');
  let remarks = $('#remarks').val();
  
  if(amountBal == '' || remarks == '' || ref_no == '') {
    Swal.fire(
        'Some fields are empty!',
        'Please complete all the information.',
        'warning'
      )
  }
  else {
    Swal.fire({
      title: 'Adding funds confirmation?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Proceed',
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
          addFunds(amountBal,remarks);
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  
});  


var addFunds = function (amountBal,remarks) {

  let adminId = $('#addadminId').val();
  $.ajax({
    type:"post",
    dataType: "json",
    data:{
      admin_id: adminId,
      financer_id: adminId,
      amount: amountBal,
      notes: remarks
      
    },
    url:"http://bolaswerte.bolaswerte.com/api/addFunds/",
    success:function(res)
    {
      Swal.fire(
        'Funds Added!',
        '',
        'success'
      )
      setTimeout(function(){ location.reload(); }, 3000);// 2seconds
        const myJson = res;
        const textres = res.data;
        console.log('res: ' + myJson);
        
        
    },
    error : function(result, statut, error){ // Handle errors
      console.log('result: ' + result.responseText);
      // let myJson = JSON.stringify(result);
      // console.log('result: ' + myJson);
    },
    complete: function() {
        $("#spinner").hide();
        //A function to be called when the request finishes 
        // (after success and error callbacks are executed). 
    }
    
 });


  
}





