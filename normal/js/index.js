var app = angular.module('MyApp');
app.controller('DemoCtrl', function ($scope, $http, $log, $filter, $location) {
    $scope.isloading = true;
    $scope.isAllowOnFull = false;
    $scope.its404Page = false;
    $scope.updateButtonMessage = "Book Now";
    $scope.registerButtonText = "Submit";
    var query = window.location.search.substring("cid");
    var vars = query.split("=");
    var campaignId = vars[1];
    if (campaignId == "84866c64-b770-4fd4-9fa7-bc61ee736269") {
        $scope.isSpecialCampaign = true;
        $scope.registerButtonText = "Claim Now"
        getCampaignInfo(campaignId);
    } else {
        $scope.isSpecialCampaign = false;
        getCampaignInfo(campaignId);
    }
    //getCampaignInfo(campaignId);
    $scope.heading = "Please confirm the following details"
    $scope.pref = "";
    var dt = new Date();
    $scope.ctrl = {
        maxDate: new Date(
            dt.getFullYear() - 10,
            dt.getMonth(),
            dt.getDate()
        )
    }

    $scope.resourseList = ["Newspaper", "Paper insert / Flyer", "SMS", "A Friend", "Facebook", "Website", "Email Marketing","Uber/Uber Eats"];
    $scope.selected = {
        date: {},
        time: {},
        resource: ""
    };
    $scope.updated = {
        date: {},
        time: {}
    }
    $scope.user = {
        fullName: '',
        gender: '',
        email: '',
        mobile: '',
        dob: undefined,
        noOfPerson: '',
        locality: '',
        remark: '',
        date: '',
        timeSlot: ''
    };
    $scope.userObj = {
        fullName: '',
        gender: '',
        email: '',
        mobile: '',
        dob: undefined,
        noOfPerson: '',
        locality: '',
        remark: '',
        date: '',
        timeSlot: '',
        token: ''
    };
    $scope.registerForm = {
        noOfPerson: undefined
    }
    $scope.dateArr = [];
    $scope.timeArr = [];
    $scope.day = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    $scope.month = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"];

    $scope.verify = {
        enterOtp: ''
    }

    function getCampaignInfo(campaignId) {
        $http.get('../campaign-1.0/campaign/info/' + campaignId)
            .success(function (data) {
                if (data.messageType == "SUCCESS" && data.isPromoCampaign==0) {
                    $scope.campaignInfo = data;
                    $scope.registerForm.noOfPerson = data.noOfPerson;
                    if ($scope.campaignInfo.campaignOverText.indexOf(".") >= 0) {
                        var campaignOverArr = $scope.campaignInfo.campaignOverText.split(".");
                        $scope.campaignOverText1 = campaignOverArr[0] + ".";
                        var text = "";
                        for (var i = 1; i < campaignOverArr.length; i++) {
                            text += campaignOverArr[i] + ".";
                        }
                        $scope.campaignOverText2 = text;
                    } else {
                        $scope.campaignOverText1 = $scope.campaignInfo.campaignOverText
                    }
                    $scope.nopMaxlength = 1;
                    var num = $scope.campaignInfo.noOfPerson;
                    var regex = new RegExp("^[" + 1 + "-" + num + "]");
                    $scope.NoOfPersonPattern = regex;
                    
                    $scope.headerInfo = data.header;
                    /*$scope.campaignLogo="img/"+data.header.logo;*/
                    $scope.campaignLogo="../campaignUploads/"+data.header.logo;
                    //$scope.campaignLogo = "http://barbeque.theuniquemedia.in/uploads/" + data.header.logo;
                    $scope.campaignIcon = "img/" + data.header.icon;
                    getAvalibility(campaignId);
                } else {
                    $scope.isloading = false;
                    $scope.its404Page = true;
                }
            })
            .error(function (err) {
                $log.error(err);
            })

    }

    function getAvalibility(campaignId) {
        $http.get('../campaign-1.0/campaign/slots/' + campaignId)
            .success(function (data) {
                if (data.messageType == "SUCCESS" && data.dates.length > 0) {
                    $scope.dateArr = data.dates;
                    $scope.isloading = false;
                    $scope.dateArr = data.dates;
                    $scope.timeArr = data.slots;
                    $scope.isUpdatePage = "false";
                    $scope.isErrorPage = "false";
                    $scope.isRegisterPage = "true";
                    $scope.isVerifyOtpPage = "false";
                    $scope.isSlotFullMessage = false;
                    $scope.otpResended = false;
                    $scope.isConfirmPage = "false";
                    $scope.wrongOtp = "false";
                    $scope.verifyFailed = "false";
                }
                else if(campaignId == "84866c64-b770-4fd4-9fa7-bc61ee736269"){
                  $scope.isloading = false;
                  $scope.isSpecialCampaign = true;
                  $scope.isUpdatePage = "false";
                  $scope.isRegisterPage = "true";
                  $scope.isVerifyOtpPage = "false";
                  $scope.isConfirmPage = "false";
                  $scope.registerButtonText = "Claim Now"
                }else{
                    $scope.isloading = false;
                    $scope.isErrorPage = "false";
                    $scope.isRegisterPage = "false";
                    $scope.isVerifyOtpPage = "false";
                    $scope.isConfirmPage = "false";
                    if ($scope.campaignInfo.isAllowOnFull == 1 && $scope.campaignInfo.status == "A") {
                        $scope.isAllowOnFull = true;
                        $scope.isRegisterPage = "true";
                        $scope.registerButtonText = "Submit"
                    } else {
                        $scope.isSlotFullMessage = true;
                    }
                }
            })
            .error(function (err) {

                $log.error(err);
            })
    }

    function getUpdatedAvalibility(campaignId) {
        $http.get('../campaign-1.0/campaign/slots/' + campaignId)
            .success(function (data) {
                if (data.messageType == "SUCCESS" && data.dates.length > 0) {
                    $scope.dateArr = data.dates;
                }
                else {
                    $scope.isErrorPage = "false";
                    $scope.isRegisterPage = "false";
                    $scope.isVerifyOtpPage = "false";
                    $scope.isConfirmPage = "false";
                    if ($scope.campaignInfo.isAllowOnFull == 1 && $scope.campaignInfo.status == "A") {
                        $scope.isAllowOnFull = true;
                        $scope.isUpdatePage = "true";
                        $scope.updateButtonMessage = "Book Now"
                    } else {
                        $scope.isSlotFullMessage = true;
                    }
                }
            })
            .error(function (err) {

                $log.error(err);
            })

    }

    $scope.noTimeSlotRemaining = false;
    $scope.onDateChange = function () {
        $scope.registerForm.noOfPerson = $scope.campaignInfo.noOfPerson;
        $scope.selected.time = {};
        var tempTimeArr = $scope.selected.date.time;
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0)
        var selectedDate = new Date($scope.selected.date.date);
        if (selectedDate.getTime() == currentDate.getTime()) {
            $scope.timeArr = filterToSkipPastTime(tempTimeArr);
            if ($scope.timeArr.length == 0) {
                $scope.noTimeSlotRemaining = true;
            }
        } else {
            $scope.timeArr = $scope.selected.date.time;
        }
    }
    $scope.onTimeSlotChange = function (obj) {
        if (obj.capacity < $scope.campaignInfo.noOfPerson) {
            $scope.registerForm.noOfPerson = obj.capacity;
        } else {
            $scope.registerForm.noOfPerson = $scope.campaignInfo.noOfPerson;
        }
    }

    $scope.onUpdatedDateChange = function () {
        $scope.registerForm.noOfPerson = $scope.campaignInfo.noOfPerson;
        $scope.updated.time = undefined;
        var tempTimeArr = $scope.updated.date.time;
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0)
        var selectedDate = new Date($scope.updated.date.date);
        if (selectedDate.getTime() == currentDate.getTime()) {
            $scope.timeArr = filterToSkipPastTime(tempTimeArr);
        }
        else {
            $scope.timeArr = $scope.updated.date.time;
        }
    }

    function filterToSkipPastTime(items) {
        if (angular.isDefined(items)) {
            var filtered = [];
            var hr = new Date().getHours();
            var mm = new Date().getMinutes();
            var timeSlot = hr + ":" + mm;
            for (var i = 0; i < items.length > 0; i++) {
                var time = items[i].time;
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12) hours = hours + 12;
                if (AMPM == "AM" && hours == 12) hours = hours - 12;
                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                var oTimeSlot = sHours + ":" + sMinutes;
                if (timeSlot <= oTimeSlot) {
                    filtered.push(items[i]);
                }
            }
            return filtered;
        }
    };


    $scope.processData = function (valid) {
        if (valid) {
            $scope.isRegisterPage = "true";
            $scope.isVerifyOtpPage = "false"

        }
    }


    $scope.getOTP = function (valid) {
        if (valid) {
            $scope.registerSubmit = true;
            $scope.user.date = $scope.selected.date.date;
            $scope.user.timeSlot = $scope.selected.time.time;
            $scope.user.resource = $scope.selected.resource;
            var tempObj = $scope.user;
            var obj = tempObj;
            if (angular.isDefined(tempObj.dob)) {
                var tempDob = $filter('date')(tempObj.dob, 'yyyy-MM-dd HH:mm:ss');
            } else {
                obj.dob = "";
            }
            obj.dob = tempDob;
            obj.campaignId = campaignId;

            if (campaignId == "84866c64-b770-4fd4-9fa7-bc61ee736269") {
                $scope.user.isSpecialCampaign = 1;
                obj.date = "";
                obj.timeSlot = "";
                obj.noOfPerson=null;

            } else {
                $scope.user.isSpecialCampaign = 0;
                if ($scope.isAllowOnFull == true) {
                    obj.date = "";
                } else {
                    var myDate = tempObj.date;
                    myDate = myDate.split("-");
                    var mIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(myDate[1]);
                    var dt2 = new Date(myDate[2], mIndex, myDate[0], 00, 00, 00)
                    var tempDateString = $filter('date')(dt2, 'yyyy-MM-dd HH:mm:ss');
                    obj.date = tempDateString;
                }
                if ($scope.isAllowOnFull == true) {
                    obj.timeSlot = "";
                }
            }

            $http.post('../campaign-1.0/campaignCustomer/getOtp', obj)
                .success(function (data) {
                    if (data.messageType == "SUCCESS") {
                        $scope.registerSubmit = false;
                        $scope.currentCustomer = parseInt(data.message);
                        $scope.isRegisterPage = "false";
                        $scope.isVerifyOtpPage = "true"
                        $scope.heading = "Please enter the One Time Password(OTP) sent to your mobile number";
                    } else if (data.message.indexOf("InactiveCampaign") >= 0) {
                        $scope.registerSubmit = false;
                        window.location.reload(true);
                    } else {
                        $scope.errorMsg = data.message;
                        $scope.registerSubmit = false;
                    }
                })
                .error(function (err) {
                    $scope.registerSubmit = false;
                    $scope.isRegisterPage = "true";
                    $scope.isVerifyOtpPage = "false"
                    $log.error(err);
                })
        }
    }

    $scope.verifyDisabled = false;
    $scope.verifyOTP = function (valid) {
        if (valid) {
            $scope.verifySubmit = true;
            $scope.verifyFailed = "false";
            $scope.wrongOtp = "false"
            $scope.otpResended = false;

            if (angular.isDefined($scope.verify.enterOtp)) {
                var obj = {
                    mobile: $scope.user.mobile,
                    otp: $scope.verify.enterOtp,
                    campaignId: campaignId
                }
                $http.post('../campaign-1.0/campaignCustomer/verifyOtp', obj)
                    .success(function (data) {
                        if (data.messageType == "SUCCESS") {
                            $scope.verifyDisabled = true;
                            register(data.message);
                        } else if (data.message.indexOf("InactiveCampaign") >= 0) {
                            window.location.reload(true);
                        } else if (data.message.indexOf("Invalid") >= 0) {
                            $scope.wrongOtp = "true";
                            $scope.verifySubmit = false;
                            $scope.verify.enterOtp = undefined;
                        } else {
                            $scope.verifyFailed = "true";
                            $scope.verifySubmit = false;
                            $scope.verify.enterOtp = undefined;
                        }
                    })
                    .error(function (err) {
                        $log.error(err);
                        $scope.verifySubmit = false;
                    })
            }
        }
    }

    $scope.resendOTP = function () {
        $scope.user.date = $scope.selected.date.date;
        var tempObj = $scope.user;
            var obj = tempObj;
            if (angular.isDefined(tempObj.dob)) {
                var tempDob = $filter('date')(tempObj.dob, 'yyyy-MM-dd HH:mm:ss');
            } else {
                obj.dob = "";
            }
            obj.dob = tempDob;
            obj.campaignId = campaignId;

            if (campaignId == "84866c64-b770-4fd4-9fa7-bc61ee736269") {
                $scope.user.isSpecialCampaign = 1;
                obj.date = "";
                obj.timeSlot = "";
                obj.noOfPerson=null;

            } else {
                $scope.user.isSpecialCampaign = 0;
                if ($scope.isAllowOnFull == true) {
                    obj.date = "";
                } else {
                    var myDate = tempObj.date;
                    myDate = myDate.split("-");
                    var mIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(myDate[1]);
                    var dt2 = new Date(myDate[2], mIndex, myDate[0], 00, 00, 00)
                    var tempDateString = $filter('date')(dt2, 'yyyy-MM-dd HH:mm:ss');
                    obj.date = tempDateString;
                }
                if ($scope.isAllowOnFull == true) {
                    obj.timeSlot = "";
                }
            }

        $http.post('../campaign-1.0/campaignCustomer/getOtp', obj)
            .success(function (data) {
                if (data.messageType == "SUCCESS") {
                    $scope.verifyFailed = "false";
                    $scope.wrongOtp = "false"
                    $scope.otpResended = true;
                }
                else {
                    $scope.otpResended = false;
                }

            })
            .error(function (err) {
            })
    }

    $scope.$watch('verify.enterOtp', function () {
        if (angular.isDefined($scope.verify.enterOtp)) {
            $scope.verifyFailed = "false";
            $scope.wrongOtp = "false"
            $scope.otpResended = false;
        }
    });

    $scope.isAllowMessageShow = false;

    function register(token) {
        var obj = $scope.user;
        obj.token = token;
        obj.customerId = $scope.currentCustomer;
        obj.campaignId = campaignId;
        if (campaignId == "84866c64-b770-4fd4-9fa7-bc61ee736269") {
            obj.isSpecialCampaign = 1;
            obj.noOfPerson=null;
        } else {
            obj.isSpecialCampaign = 0;
        }
        if ($scope.isAllowOnFull) {
            $scope.verifySubmit = false;
            $scope.verifyDisabled = false;
            $scope.isAllowMessageShow = true;
            $scope.isVerifyOtpPage = "false"
        } else {
            $http.post('../campaign-1.0/campaignCustomer/register', obj)
                .success(function (data) {
                    if (data.messageType == "SUCCESS") {
                        $scope.verifySubmit = false;
                        $scope.verifyDisabled = false;
                        $scope.isConfirmPage = "true";
                        $scope.isVerifyOtpPage = "false"
                        if(campaignId=="84866c64-b770-4fd4-9fa7-bc61ee736269"){
                            $scope.coupanCode=data.message;
                        }
                    } else if (data.message.indexOf("SLOTISFULL") >= 0) {
                        var msg = data.message.split("-");
                        $scope.pref = msg[1];
                        getUpdatedAvalibility(campaignId);
                        $scope.isUpdatePage = "true";
                        $scope.isVerifyOtpPage = "false"
                    } else if (data.message.indexOf("WaitListed") >= 0) {
                        $scope.isVerifyOtpPage = "false"
                        $scope.isWaitListed = true;
                    } else if(data.message.indexOf("already")>= 0){
                        $scope.isVerifyOtpPage = "false"
                        $scope.isErrorPage = "true";
                    } else{
                        $scope.isVerifyOtpPage = "false"
                        $scope.isErrorPage = "true";
                    }
                })
                .error(function (err) {
                    $scope.user = $scope.userObj;
                    $scope.isRegisterPage = "true";
                    $scope.isVerifyOtpPage = "false";
                    $scope.isConfirmPage = "false";
                    $scope.isUpdatePage = "false";
                    $scope.isErrorPage = "false";
                    $scope.verifySubmit = false;
                })
        }

    }

    $scope.updateCustomer = function (valid) {
        if (valid) {
            $scope.updateSubmit = true;
            var obj = {date: '', time: '', id: ''};
            obj.id = parseInt($scope.pref);
            if (angular.isDefined($scope.updated.date.date)) {
                var myDate = $scope.updated.date.date;
                myDate = myDate.split("-");
                var mIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(myDate[1]);
                var dt2 = new Date(myDate[2], mIndex, myDate[0], 00, 00, 00)
                var tempDateString = $filter('date')(dt2, 'yyyy-MM-dd HH:mm:ss');
                obj.date = tempDateString;
            } else if ($scope.isAllowOnFull == true) {
                obj.date = "";
            }
            if ($scope.isAllowOnFull == true) {
                obj.time = "";
            } else {
                obj.time = $scope.updated.time.time;
            }
            obj.campaignId = campaignId;
            $http.post('../campaign-1.0/campaignCustomer/update', obj)
                .success(function (data) {
                    if (data.messageType == "SUCCESS") {
                        $scope.selected.date = $scope.updated.date;
                        $scope.selected.time = $scope.updated.time;
                        $scope.updateSubmit = false;
                        $scope.isConfirmPage = "true";
                        $scope.isUpdatePage = "false"
                       
                    } else if (data.message.indexOf("WaitListed") >= 0) {
                        $scope.updateSubmit = false;
                        $scope.isUpdatePage = "false"
                        $scope.isWaitListed = true;
                    } else {
                        $scope.updateSubmit = false;
                        $scope.isUpdatePage = "false";
                        $scope.isErrorPage = "true";
                    }
                })
                .error(function (err) {
                    $scope.user = $scope.userObj;
                    $scope.isRegisterPage = "true";
                    $scope.isVerifyOtpPage = "false";
                    $scope.isConfirmPage = "false";
                    $scope.isUpdatePage = "false";
                    $scope.isErrorPage = "false";
                    $scope.updateSubmit = false;
                })
        }
    }
});
