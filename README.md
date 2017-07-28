> 在@JetLua的netease-cloud-music模块基础上修改而来

### 安装
  ```bash
  $ npm install nestmusic --save
  ```

### 用法
  ```js
  const music=require('nestmusic')
  music.login('手机号','密码')
    .then(res=>{
      console.log(res)
    })
  ```

### API
  ```js
  // 以下全部返回promise
  music.login(phone,pwd) // 模拟登录（只做了手机登录），参数(手机号,密码)
  music.getUri(songid) // 获取歌曲mp3地址，参数(歌曲id)
  music.getPlayList(listid) // 获取歌单所有歌曲，参数(歌单id)
  music.getComments(songid) // 获取歌曲评论，参数(歌曲id)
  music.getHotList() // 获取热门排行榜歌曲，无参数
  music.getUserPlayList(uid) // 获取指定用户的歌单，参数（用户id）
  music.getHotPlayList() // 获取热门歌单，无参数
  ```

