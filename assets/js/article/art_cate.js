$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // 运行模板引擎函数
                // 会返回一个渲染好的字符串 需要定义一个变量来接收
                var htmlStr = template('tpl-table', res)
                // 把渲染好的字符串在页面上显示
                $('tbody').html(htmlStr)
            }
        })
    }

    // 定义一个变量来接收索引
    var indexAdd = null
    // 添加分类弹出层按钮添加点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    })

    // 通过代理 为 form-add 绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('新增文章分类失败')
                initArtCateList()
                layer.msg('新增文章分类成功')

                // 根据索引 关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 定义一个变量来接收索引
    var indexEdit = null
    // 通过代理  为编辑按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')

        // 根据 Id 获取文章分类数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理 为修改分类绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('修改分类失败')
                initArtCateList()
                layer.msg('修改分类成功')

                // 根据索引 关闭对应弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 通过代理 为删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除失败')
                    layer.msg('删除成功')
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})