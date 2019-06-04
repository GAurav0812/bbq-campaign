var app = angular.module('MyApp', ['ngMaterial', 'ngSanitize', 'ngMessages']);
app.filter('unsafe', function ($sce) {
    return $sce.trustAsHtml;
});
app.controller('DemoCtrl', function ($scope, $http, $log) {
    angular.element(document).ready(function () {
        $scope.isloading = true;
        $scope.its404Page = false;
        $scope.isVoucherOver = false;
        $scope.registerButtonText = "Submit";
        $scope.inValidUserPage = false;
        var query = window.location.search.substring("cid");
        var vars = query.split("=");
        var campaignId = getQueryStringValue("cid");
        getCampaignInfo(campaignId);
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

        $scope.resourseList = ["Hoarding", "SMS", "Social Media", "Friends", "News Paper"];
        $scope.selected = {
            resource: ""
        };
        $scope.user = {
            fullName: '',
            gender: '',
            email: '',
            mobile: '',
            dob: '',
            noOfPerson: null,
            locality: '',
            remark: '',
            date: '',
            timeSlot: '',
            ageGroup: '',
            rating: null,
            resource: '',
            isSpecialCampaign: 1,
            campaignId: '',
            occupation: '',
            pastDinedCity: ''
        };
        $scope.userObj = {
            fullName: '',
            gender: '',
            email: '',
            mobile: '',
            dob: '',
            noOfPerson: null,
            locality: '',
            remark: '',
            date: '',
            timeSlot: '',
            token: '',
            timeSlot: '',
            ageGroup: '',
            rating: null,
            resource: '',
            isSpecialCampaign: 1,
            campaignId: '',
            occupation: '',
            pastDinedCity: ''
        };
        $scope.registerForm = {
            noOfPerson: undefined
        }
        $scope.verify = {
            enterOtp: ''
        }
        $scope.isDataCapturingCamp = false;

        function getQueryStringValue(key) {
            return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        }

        function defaultFieldsConfig() {
            return {
                fullName: true,
                mobile: true,
                email: true,
                hearQues: true,
                age: true,
                gender: true,
                locality: true,
                satisfyRate: true,
                suggestions: true,
                occupation: true,
                dinedQues: true
            }
        }

        function getCampaignInfo(campaignId) {
            $http.get('../campaign-1.0/campaign/info/' + campaignId)
                .success(function (data) {
                    if (data.messageType == "SUCCESS" && data.isPromoCampaign == 1) {
                        $scope.campaignInfo = data;
                        if (!data.fieldsConfig) {
                            $scope.campaignInfo.fieldsConfig = defaultFieldsConfig();
                        } else {
                            $scope.campaignInfo.fieldsConfig = JSON.parse($scope.campaignInfo.fieldsConfig);
                        }
                        if (data.onlyDataCapture == 1) {
                            $scope.isDataCapturingCamp = true;
                        } else {
                            $scope.isDataCapturingCamp = false;
                        }
                        $scope.isloading = false;
                        $scope.headerInfo = data.header;
                        $scope.campaignLogo = "../campaignUploads/" + data.header.logo;
                        //$scope.campaignLogo = "http://barbeque.theuniquemedia.in/uploads/" + data.header.logo;
                        $scope.campaignIcon = "img/" + data.header.icon;
                        $scope.isUpdatePage = "false";
                        $scope.isErrorPage = "false";
                        $scope.isVerifyOtpPage = "false";
                        $scope.isSlotFullMessage = false;
                        $scope.otpResended = false;
                        $scope.isConfirmPage = "false";
                        $scope.wrongOtp = "false";
                        $scope.verifyFailed = "false";
                        if ($scope.campaignInfo.status == "A") {
                            $scope.isRegisterPage = "true";
                        } else {
                            $scope.isSlotFullMessage = true;
                        }
                    } else {
                        $scope.isloading = false;
                        $scope.its404Page = true;
                    }
                })
                .error(function (err) {
                    $log.error(err);
                })
        }

        $scope.getOTP = function (valid) {

            if (valid) {
                if ($scope.campaignInfo.onlyDataCapture == 1) {
                    getOtpFunc()

                } else {

                    var mobile = $scope.user.mobile;
                    var postData = {
                        campaignId: campaignId,
                        mobile: mobile
                    }
                    $http.post('../campaign-1.0/campaignCustomer/checkForMobile', postData)
                        .success(function (data) {
                            if (data.messageType == "SUCCESS") {
                                getOtpFunc();
                            } else if (data.message.indexOf("NotExist") >= 0) {
                                $scope.isRegisterPage = "false";
                                $scope.inValidUserPage = true;
                            }
                        })
                        .error(function (err) {
                            return false
                        })
                }


            }
        }

        function getOtpFunc() {
            $scope.registerSubmit = true;
            $scope.user.resource = $scope.selected.resource;
            var tempObj = $scope.user;
            var obj = tempObj;
            obj.campaignId = campaignId;
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
            var tempObj = $scope.user;
            var obj = tempObj;
            obj.campaignId = campaignId;
            $http.post('../campaign-1.0/campaignCustomer/getOtp', obj)
                .success(function (data) {
                    if (data.messageType == "SUCCESS") {
                        $scope.verifyFailed = "false";
                        $scope.wrongOtp = "false"
                        $scope.otpResended = true;
                    } else {
                        $scope.otpResended = false;
                    }

                })
                .error(function (err) {})
        }

        $scope.$watch('verify.enterOtp', function () {
            if (angular.isDefined($scope.verify.enterOtp)) {
                $scope.verifyFailed = "false";
                $scope.wrongOtp = "false"
                $scope.otpResended = false;
            }
        });


        function register(token) {
            var obj = $scope.user;
            obj.token = token;
            obj.customerId = $scope.currentCustomer;
            obj.campaignId = campaignId;
            if ($scope.isAllowOnFull) {
                $scope.verifySubmit = false;
                $scope.verifyDisabled = false;
                $scope.isVerifyOtpPage = "false"
            } else {
                $http.post('../campaign-1.0/campaignCustomer/register', obj)
                    .success(function (data) {
                        if (data.messageType == "SUCCESS") {
                            $scope.verifySubmit = false;
                            $scope.verifyDisabled = false;
                            $scope.isConfirmPage = "true";
                            $scope.isVerifyOtpPage = "false";
                            $scope.couponCode = data.message
                        } else {
                            if (data.message.indexOf("NoMoreVouchers") >= 0) {
                                $scope.isVerifyOtpPage = "false";
                                $scope.verifySubmit = false;
                                $scope.isVoucherOver = true;
                            } else if (data.message.indexOf("InactiveCampaign") >= 0) {
                                $scope.isVerifyOtpPage = "false";
                                $scope.verifySubmit = false;
                                $scope.isSlotFullMessage = true;
                            } else {
                                $scope.isVerifyOtpPage = "false";
                                $scope.isErrorPage = "true";
                                $scope.verifySubmit = false;
                                $scope.isVoucherOver = false;
                            }
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
    })
});