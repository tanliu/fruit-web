/**
 * Created by TanLiu on 2017/2/25.
 */
function MyDialog(options) {
    var tpl = [
        '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="true">',
        '  <div class="modal-dialog">',
        '    <div class="modal-content">',
        '      <div class="modal-header">',
        '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>',
        '        <h4 class="modal-title" id="myModalLabel">'
        + (options.title || '提示') + '</h4>',
        '      </div>',
        '      <div class="modal-body">',
        '        <p>' + options.content + '</p>',
        '      </div>',
        '      <div class="modal-footer">',
        '        <button type="button" class="btn btn-default" data-dismiss="modal">'
        + (options.closeBtnText || '关闭') + '</button>',
        '        <button type="button" class="btn btn-primary js-mydialog-ok">'
        + (options.okBtnText || '确认') + '</button>',
        '      </div>', '    </div>', '  </div>', '</div>' ].join("");
    var $tpl = $(tpl);
    $("body").append($tpl)
    $tpl.modal('toggle');
    $tpl.on("click", ".js-mydialog-ok", function() {
        $tpl.modal('hide');
        $.isFunction(options.onOK) && options.onOK();
    });
}