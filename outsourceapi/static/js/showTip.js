//tip是提示信息，type:'success'是成功信息，'danger'是失败信息,'info'是普通信息
function ShowTip(tip, type) {
    var $tip = $('#tip');
    if ($tip.length == 0) {
        $tip = $('<span id="tip" style="font-weight:bold;position:absolute;top:50px;left: 50%;z-index:9999"></span>');
        $('body').append($tip);
    }
    $tip.stop(true).attr('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(500).delay(2000).fadeOut(500);
}

function ShowMsg(msg) {
    ShowTip(msg, 'info');
}

function ShowSuccess(msg) {
    ShowTip(msg, 'success');
}

function ShowFailure(msg) {
    ShowTip(msg, 'danger');
}

function ShowWarn(msg, $focus, clear) {
    ShowTip(msg, 'warning');
    if ($focus) $focus.focus();
    if (clear) $focus.val('');
    return false;
}
$.ajaxSetup({
    statusCode: {
        401: function (data) {
            ShowMsg("登录超时");
            window.location.href = '/';
        },
           403: function (data) {
               ShowMsg("Forbidden Error");
               window.location.href = '/admin/page-error-403.html';
        }
    }
})
let formDataLoad= function (domId, obj) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property) == true) {
            if ($("#" + domId + " [name='" + property + "']").length > 0) {
                $("#" + domId + " [name='" + property + "']").each(function () {
                    var dom = this;
                    if ($(dom).attr("type") == "radio") {
                        $(dom).filter("[value='" + obj[property] + "']").attr("checked", true);
                    }
                    if ($(dom).attr("type") == "checkbox") {
                        obj[property] == true ? $(dom).attr("checked", "checked") : $(dom).attr("checked", "checked").removeAttr("checked");
                    }
                    if ($(dom).attr("type") == "text" || $(dom).prop("tagName") == "SELECT" || $(dom).attr("type") == "hidden" || $(dom).attr("type") == "textarea") {
                        $(dom).val(obj[property]);
                    }
                    if ($(dom).prop("tagName") == "TEXTAREA") {
                        $(dom).val(obj[property]);
                    }
                    if ($(dom).prop("tagName") == "IMG") {
                        $(dom).attr('src',obj[property]);
                    }
                });
            }
        }
    }}
let timeUtil = {
    // 年月日，时分秒
    getFullTime() {
        let date = new Date(), //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            Y = date.getFullYear() + '-',
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+ '-',
            D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ',
            h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours())+ ':',
            m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())+ ':',
            s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s
    },

    // 获取当前时间戳
    getLocalTime() {
        return new Date().getTime();
    },

    // 时间戳
    time2TimeStap(timer) {
        return new Date(timer).getTime();
    }
}
let modalConfirm = function (info) {
    let modal = `<div class="modal fade" id="ConfirmModal" style="display: none;" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Confirm</h5>
                                                    <button type="button" class="close" data-dismiss="modal"><span>×</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">${info}</div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary">OK</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;


};