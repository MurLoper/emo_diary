/**
 * API 请求封装
 */

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api'; // 生产环境需修改

/**
 * 通用请求方法
 */
function request(url, method = 'GET', data = {}, needAuth = true) {
  return new Promise((resolve, reject) => {
    // 构建header
    const header = {
      'Content-Type': 'application/json'
    };

    // 添加认证token
    if (needAuth) {
      const app = getApp();
      const token = (app && app.globalData && app.globalData.token) || wx.getStorageSync('token');
      if (token) {
        header['Authorization'] = `Bearer ${token}`;
      }
    }

    wx.request({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode === 200) {
          // 返回完整的响应数据（包含 success, data, message）
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 未授权，跳转登录
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          });

          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1500);

          reject(new Error('未授权'));
        } else {
          wx.showToast({
            title: (res.data && res.data.message) || '请求失败',
            icon: 'none'
          });
          reject(new Error((res.data && res.data.message) || '请求失败'));
        }
      },
      fail: (error) => {
        console.error('请求失败:', error);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(error);
      }
    });
  });
}

/**
 * GET请求
 */
function get(url, data = {}, needAuth = true) {
  return request(url, 'GET', data, needAuth);
}

/**
 * POST请求
 */
function post(url, data = {}, needAuth = true) {
  return request(url, 'POST', data, needAuth);
}

/**
 * PUT请求
 */
function put(url, data = {}, needAuth = true) {
  return request(url, 'PUT', data, needAuth);
}

/**
 * DELETE请求
 */
function del(url, data = {}, needAuth = true) {
  return request(url, 'DELETE', data, needAuth);
}

/**
 * 文件上传
 */
function uploadFile(filePath, formData = {}) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    const token = (app && app.globalData && app.globalData.token) || wx.getStorageSync('token');

    wx.uploadFile({
      url: `${API_BASE_URL}/upload/image`,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.success) {
          resolve(data.data);
        } else {
          wx.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          });
          reject(new Error(data.message));
        }
      },
      fail: (error) => {
        console.error('上传失败:', error);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        reject(error);
      }
    });
  });
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  uploadFile
};
