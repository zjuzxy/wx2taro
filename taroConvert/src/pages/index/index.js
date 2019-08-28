import { Block, View, Button, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
//index.js
//获取应用实例
const app = Taro.getApp()

@withWeapp('Page')
class _C extends Taro.Component {
  state = {
    motto: 'Hello World',
    js_code: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: Taro.canIUse('button.open-type.getUserInfo')
  }
  bindViewTap = () => {
    Taro.navigateTo({
      url: '../logs/logs'
    })
  }

  componentWillMount() {
    Taro.login({
      success: res => {
        console.log(res)
        this.setData({
          js_code: res.code
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      Taro.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }

  getUserInfo = e => {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  getPhoneNumber = e => {
    console.log(e)
    console.log(this)
    var _this = this
    let { encryptedData, iv } = e.detail
    Taro.request({
      url: 'https://richchannel.cn:8443/RichChannel/weChat/login',
      data: {
        js_code: _this.data.js_code,
        appid: '964616b4fd334baa846a1847b06a7d51',
        buildType: 'mp-weixin'
      },
      success: e => {
        console.log(e)
        var session_key = JSON.parse(e.data.result).session_key
        Taro.request({
          url: 'https://richchannel.cn:8443/RichChannel/weChat/getUserInfo',
          dataType: 'json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            sessionKey: session_key,
            encryptedData: encryptedData,
            iv: iv
          },
          success: function(e) {
            console.log(e)
          }
        })
      }
    })
  }
  config = {}

  render() {
    const { hasUserInfo, canIUse, userInfo, motto } = this.state
    return (
      <View className="container">
        <View className="userinfo">
          {!hasUserInfo && canIUse ? (
            <Button openType="getUserInfo" onGetuserinfo={this.getUserInfo}>
              获取头像昵称
            </Button>
          ) : (
            <Block>
              <Image
                onClick={this.bindViewTap}
                className="userinfo-avatar"
                src={userInfo.avatarUrl}
                mode="cover"
              ></Image>
              <Text className="userinfo-nickname">{userInfo.nickName}</Text>
            </Block>
          )}
        </View>
        <View className="usermotto">
          <Text className="user-motto">{motto}</Text>
        </View>
        <View>
          <Button
            openType="getPhoneNumber"
            onGetphonenumber={this.getPhoneNumber}
          >
            手机号
          </Button>
        </View>
      </View>
    )
  }
}

export default _C
