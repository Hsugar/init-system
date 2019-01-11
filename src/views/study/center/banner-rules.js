
/*
  表单校验
*/

export const href = [
  {
    required: true,
    message: '请输入直客链接',
    trigger: 'blur'
  },
  {
    validator (rule, value, callback) {
      const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
      if (!reg.test(value)) {
        callback(new Error('链接输入有误，请重新输入'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

export const href_agent = [
  {
    required: true,
    message: '请输入代理商链接',
    trigger: 'blur'
  },
  {
    validator (rule, value, callback) {
      const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
      if (!reg.test(value)) {
        callback(new Error('链接输入有误，请重新输入'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

export const imageUrl = [
  {
    required: true,
    message: '请上传轮播图图片',
    trigger: 'blur'
  }
]
