/*
  表单校验
*/

// export const jumpUrl = [
//   {
//     required: true,
//     message: '请输入视频链接：',
//     trigger: 'blur'
//   }, {
//     validator(rule, value, callback) {
//       const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
//       if (!reg.test(value)) {
//         callback(new Error('链接输入有误，请重新输入'))
//       } else {
//         callback()
//       }
//     },
//     trigger: 'blur'
//   }
// ]

export const image_url = [
  {
    required: true,
    message: '请上传封面图',
    trigger: 'blur'
  }
]

export const video_oss_id = [
  {
    required: true,
    message: '请上传视频',
    trigger: 'blur'
  }
]

// export const grade = [
//   {
//     required: true,
//     message: '请对视频评级',
//     trigger: 'blur'
//   },
//   {
//     validator (rule, value, callback) {
//       if (value < 1 || value > 5) {
//         callback(new Error('请对视频评级, 等级为1星到5星'))
//       } else {
//         callback()
//       }
//     },
//     trigger: 'blur'
//   }
// ]

// export const dynamicTags = [
//   {
//     required: true,
//     message: '请添加视频标签',
//     trigger: 'blur'
//   },
//   {
//     validator(rule, value, callback) {
//       if (value.length < 1) {
//         callback(new Error('请添加视频标签'))
//       }else {
//         callback()
//       }
//     },
//     trigger: 'blur'
//   }
// ]

export const type = [
  {
    required: true,
    message: '请选择客户类型',
    trigger: 'blur'
  }
]

export const class_id = [
  {
    required: true,
    message: '请选择视频分类',
    trigger: 'blur'
  }
]

export const video_title = [
  {
    required: true,
    message: '请输入视频标题',
    trigger: 'blur'
  }
]
