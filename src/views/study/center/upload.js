import _ from 'lodash'
import OSS from '@/assets/scripts/lib/aliyun-oss-sdk-5.2.0.min'
import '@/assets/scripts/aliyun-upload-sdk-1.4.0.min'

window.OSS = OSS

import { getVideoConfig, videoPath } from '@/service/study'

const eventMao = {
  // 文件上传失败
  onUploadFailed: [],
  // 文件上传完成
  onUploadSucceed: [],
  // 文件上传进度
  onUploadSucceed: [],
  // STS临时账号会过期，过期时触发函数
  onUploadTokenExpired: [],
  // 开始上传
  onUploadstarted: [],
  // 上传结束
  onUploadEnd: [],
  onUploadCanceled: []
}

export function $on(eventName, callback) {
  if (eventMao[eventName]) {
    eventMao[eventName].push(callback)
  }
}

// 阿里上传
export async function initAliVideoUpload () {
  let result = await getVideoConfig()
  let {accessKeyId, VideoId, accessKeySecret, UploadAuth, UploadAddress} = result
  const uploader = new AliyunUpload.Vod({
    // 文件上传失败
    'onUploadFailed': function (uploadInfo, code, message) {
      // that.$data.vedioLoad = false
      // that.$data.vedioFail = true
      // console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
      _.each(eventMao['onUploadFailed'], callback => {
        callback(uploadInfo, code, message, result)
      })
    },
    // 文件上传完成
    'onUploadSucceed': function (uploadInfo) {
      // console.log(uploadInfo)
      // that.$data.vedioLoad = false
      // that.$data.vedioSuccess = true
      // console.log("onUploadSucceed: " + uploadInfo.videoId);
      _.each(eventMao['onUploadSucceed'], callback => {
        callback(uploadInfo, result)
      })
    },
    // 文件上传进度
    'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
      // console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + (loadedPercent * 100.00).toFixed(2) + "%");
      _.each(eventMao['onUploadProgress'], callback => {
        callback(uploadInfo, totalSize, loadedPercent, result)
      })
    },
    // STS临时账号会过期，过期时触发函数
    'onUploadTokenExpired': function (uploadInfo) {
      // console.log("onUploadTokenExpired");
      _.each(eventMao['onUploadTokenExpired'], callback => {
        callback(uploadInfo, result)
      })
    },
    'onUploadCanceled': function(uploadInfo) {
      // console.log("onUploadCanceled:file:" + uploadInfo.file.name);
      _.each(eventMao['onUploadCanceled'], callback => {
        callback(uploadInfo, result)
      })
    },
    // 开始上传
    'onUploadstarted': async function (uploadInfo) {
      // that.$data.vedioLoad = true
      uploader.setUploadAuthAndAddress(uploadInfo, UploadAuth, UploadAddress, VideoId);

      _.each(eventMao['onUploadstarted'], callback => {
        callback(uploadInfo, result)
      })
    },
    'onUploadEnd':function(uploadInfo){
      // console.log("onUploadEnd: uploaded all the files");
      _.each(eventMao['onUploadEnd'], callback => {
        callback(uploadInfo, result)
      })
    }
  })
  return {
    uploader: uploader,
    config: result
  }
}


export async function onAliVideoUpload ($event) {
  const { uploader, config } = await initAliVideoUpload()
  let files = $event.target.files
  let _data = {
    "Vod": {
      "StorageLocation": "",
      "UserData": {
        "IsShowWaterMark": "false",
        "Priority": "7"
      }
    }
  }
  let userData = JSON.stringify(_data)
  for (var f = 0; f < files.length; f++) {
    uploader.addFile($event.target.files[f], null, null, null, userData)
  }
  // let result = await getVideoConfig()
  // this.video_oss_id = result.VideoId
  let {accessKeyId, accessKeySecret, secretToken} = config
  uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken)
  uploader.startUpload()
  return {
    uploader, config
  }
}
