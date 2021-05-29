$(function () {
    // 点击去注册账号
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })
    // 点击去登录
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取form元素
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()自定义校验规则
    form.verify({
        // 自定义一个叫做pwd的密码校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义一个叫做repwd的检查两次密码是否一致的校验规则
        repwd: function (valut) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次是否相等的判断
            // 不相等则return一个错误提示
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== valut) {
                return "两次密码不一致！"
            }
        }
    })

    // 监听注册表单的注册提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认行为
        e.preventDefault()
        // 灵活性写法
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        // 发起POST请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功!');
            // 模拟人的点击行为
            $('#link_login').click()

        })
    })

    // 监听登录事件
    $('#form_login').submit(function (e) {
        // 阻止默认
        e.preventDefault()
        $.ajax({
            method: 'post',
            // url 千万不能大写！！！
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg(res.message)
                // 将登陆成功得到的 token 字符窜 保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})