/**
 * @description 工具入口文件
 * @author qingsds
 */
import axios, { MODE } from './axios'

export const get = axios.get
export const post = axios.post

export const typeMap = {
  1: {
    icon: 'canyin',
  },
  2: {
    icon: 'fushi',
  },
  3: {
    icon: 'jiaotong',
  },
  4: {
    icon: 'riyong',
  },
  5: {
    icon: 'gouwu',
  },
  6: {
    icon: 'xuexi',
  },
  7: {
    icon: 'yiliao',
  },
  8: {
    icon: 'lvxing',
  },
  9: {
    icon: 'renqing',
  },
  10: {
    icon: 'qita',
  },
  11: {
    icon: 'gongzi',
  },
  12: {
    icon: 'jiangjin',
  },
  13: {
    icon: 'zhuanzhang',
  },
  14: {
    icon: 'licai',
  },
  15: {
    icon: 'tuikuang',
  },
  16: {
    icon: 'qita',
  },
}

export const REFRESH_STATE = {
  pulling: 'pulling',
  canRelease: 'canRelease',
  refreshing: 'refreshing',
  complete: 'complete',
}

export const LOAD_STATE = {
  normal: 0, // 普通
  abort: 1, // 中止
  loading: 2, // 加载中
  success: 3, // 加载成功
  failure: 4, // 加载失败
  complete: 5, // 加载完成（无新数据）
}

/**
 * 校验上传文件的工具函数
 */
const fileTypes = ['image/jpeg', 'image/pjpeg', 'image/png']
export const ValidFileType = file => {
  return fileTypes.includes(file.type)
}

/**
 * 文件大小为 bytes
 * @param {number} number 文件大小
 * kb,mb
 */
export const returnFileSize = number => {
  // 小于 1kb 的情况
  if (number < 1024) {
    return number + 'bytes'
  } else if (number >= 1024 && number <= 1048576) {
    return (number / 1024).toFixed(1) + 'kb'
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + 'mb'
  }
}

export const imgUrlTrans = url => {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = MODE === 'development' ? `/api/${url}` : 'http://api.chennick.wang'
    return url
  }
}
